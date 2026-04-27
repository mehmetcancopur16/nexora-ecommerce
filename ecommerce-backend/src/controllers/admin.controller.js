const User = require("../models/User.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
const Review = require("../models/Review.model");
const ContactMessage = require("../models/ContactMessage.model");
const Coupon = require("../models/Coupon.model");
const StoreSettings = require("../models/StoreSettings.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

exports.getDashboardStats = asyncHandler(async (_req, res) => {
  const settings = await StoreSettings.findOne().lean();
  const lowStockThreshold = Number.isFinite(settings?.lowStockThreshold) ? settings.lowStockThreshold : 10;

  const [userCount, orderStats, statusDistribution, lowStockProducts, activeCouponCount, openSupportCount] = await Promise.all([
    User.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]),
    Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, status: "$_id", count: 1 } },
      { $sort: { status: 1 } },
    ]),
    Product.find({ stock: { $lt: lowStockThreshold }, isActive: true })
      .select("name stock price category")
      .sort({ stock: 1 })
      .limit(20)
      .lean(),
    Coupon.countDocuments({ isActive: true }),
    ContactMessage.countDocuments({ adminStatus: { $in: ["open", "in_progress"] } }),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers: userCount,
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalRevenue: orderStats[0]?.totalRevenue || 0,
      orderStatusDistribution: statusDistribution,
      lowStockProducts,
      activeCouponCount,
      openSupportCount,
      lowStockThreshold,
    },
  });
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (search) {
    filter.$or = [
      { email: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

exports.updateUserRoleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (String(id) === String(req.user.id)) {
    throw new ApiError(400, "Kendi hesabınızın rol/durum bilgisini bu uçtan değiştiremezsiniz", true);
  }

  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  res.json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (String(id) === String(req.user.id)) {
    throw new ApiError(400, "Kendi hesabınızı bu uçtan silemezsiniz", true);
  }

  const user = await User.findByIdAndDelete(id).select("-password");

  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  res.json({
    success: true,
    message: "Kullanıcı silindi",
  });
});

exports.getAdminCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const skip = (page - 1) * limit;
  const filter = {};
  if (search?.trim()) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const [categories, total] = await Promise.all([
    Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Category.countDocuments(filter),
  ]);

  const categoryIds = categories.map((item) => item._id);
  const productsByCategory = await Product.aggregate([
    { $match: { category: { $in: categoryIds } } },
    { $group: { _id: "$category", totalProducts: { $sum: 1 }, activeProducts: { $sum: { $cond: ["$isActive", 1, 0] } } } },
  ]);
  const statsMap = new Map(productsByCategory.map((item) => [String(item._id), item]));
  const enriched = categories.map((item) => ({
    ...item,
    totalProducts: statsMap.get(String(item._id))?.totalProducts || 0,
    activeProducts: statsMap.get(String(item._id))?.activeProducts || 0,
  }));

  res.json({
    success: true,
    data: enriched,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

exports.createAdminCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

exports.updateAdminCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new ApiError(404, "Kategori bulunamadı", true);
  }
  res.json({ success: true, data: category });
});

exports.deleteAdminCategory = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments({ category: req.params.id });
  if (productCount > 0) {
    throw new ApiError(409, "Bu kategoriye bagli urunler oldugu icin silinemez", true);
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new ApiError(404, "Kategori bulunamadı", true);
  }
  res.json({ success: true, message: "Kategori silindi" });
});

exports.getCoupons = asyncHandler(async (req, res) => {
  const { page, limit, search, status } = req.query;
  const filter = {};
  if (search) {
    filter.code = { $regex: search, $options: "i" };
  }
  if (status === "active") filter.isActive = true;
  if (status === "inactive") filter.isActive = false;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Coupon.countDocuments(filter),
  ]);
  res.json({
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

exports.createCoupon = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    code: req.body.code.toUpperCase(),
    startsAt: req.body.startsAt ? new Date(req.body.startsAt) : null,
    expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
  };
  const coupon = await Coupon.create(payload);
  res.status(201).json({ success: true, data: coupon });
});

exports.updateCoupon = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.code) payload.code = payload.code.toUpperCase();
  if (Object.prototype.hasOwnProperty.call(payload, "startsAt")) {
    payload.startsAt = payload.startsAt ? new Date(payload.startsAt) : null;
  }
  if (Object.prototype.hasOwnProperty.call(payload, "expiresAt")) {
    payload.expiresAt = payload.expiresAt ? new Date(payload.expiresAt) : null;
  }
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!coupon) throw new ApiError(404, "Kupon bulunamadı", true);
  res.json({ success: true, data: coupon });
});

exports.deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, "Kupon bulunamadı", true);
  res.json({ success: true, message: "Kupon silindi" });
});

exports.getAdminReviews = asyncHandler(async (req, res) => {
  const { page, limit, search, status } = req.query;
  const skip = (page - 1) * limit;
  const filter = {};
  if (status === "approved" || status === "rejected") {
    filter.moderationStatus = status;
  }
  if (status === "hidden") {
    filter.isHidden = true;
  }
  if (search) {
    const productIds = await Product.find({ name: { $regex: search, $options: "i" } })
      .select("_id")
      .lean();
    filter.$or = [
      { comment: { $regex: search, $options: "i" } },
      { product: { $in: productIds.map((item) => item._id) } },
    ];
  }

  const [items, total] = await Promise.all([
    Review.find(filter)
      .populate({ path: "product", select: "name" })
      .populate({ path: "user", select: "firstName lastName email" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

exports.updateAdminReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) throw new ApiError(404, "Yorum bulunamadı", true);
  await Review.calcAverageRatings(review.product);
  res.json({ success: true, data: review });
});

exports.deleteAdminReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, "Yorum bulunamadı", true);
  await Review.findOneAndDelete({ _id: req.params.id });
  res.json({ success: true, message: "Yorum silindi" });
});

exports.getAdminReports = asyncHandler(async (req, res) => {
  const { startDate, endDate, granularity = "day", topLimit = 8, tz = "Europe/Istanbul", comparePrevious = false } = req.query;

  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date(end.getTime() - 29 * 24 * 60 * 60 * 1000);

  let groupFormat = "%Y-%m-%d";
  let incrementDays = 1;
  if (granularity === "week") {
    groupFormat = "%G-W%V";
    incrementDays = 7;
  } else if (granularity === "month") {
    groupFormat = "%Y-%m";
    incrementDays = 30;
  }

  const paidRangeMatch = {
    paymentStatus: "paid",
    createdAt: {
      $gte: start,
      $lte: end,
    },
  };
  const allRangeMatch = {
    createdAt: {
      $gte: start,
      $lte: end,
    },
  };

  const [salesSummary, dailySalesRaw, topProducts, categorySales, paymentStatusStats, lowStockCount, openSupportCount] =
    await Promise.all([
      Order.aggregate([
        { $match: paidRangeMatch },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            paidOrders: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        { $match: paidRangeMatch },
        {
          $group: {
            _id: {
              $dateToString: {
                format: groupFormat,
                date: "$createdAt",
                timezone: tz,
              },
            },
            revenue: { $sum: "$totalAmount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: paidRangeMatch },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            soldUnits: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          },
        },
        { $sort: { soldUnits: -1 } },
        { $limit: topLimit },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $project: {
            _id: 0,
            productId: "$product._id",
            name: "$product.name",
            soldUnits: 1,
            revenue: 1,
          },
        },
      ]),
      Order.aggregate([
        { $match: paidRangeMatch },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            soldUnits: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $lookup: {
            from: "categories",
            localField: "product.category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: { $ifNull: ["$category.name", "Uncategorized"] },
            soldUnits: { $sum: "$soldUnits" },
            revenue: { $sum: "$revenue" },
          },
        },
        { $sort: { revenue: -1 } },
      ]),
      Order.aggregate([
        { $match: allRangeMatch },
        { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
        { $project: { _id: 0, status: "$_id", count: 1 } },
      ]),
      Product.countDocuments({ isActive: true, stock: { $lt: 10 } }),
      ContactMessage.countDocuments({ adminStatus: { $in: ["open", "in_progress"] } }),
    ]);

  const bucketMap = new Map(dailySalesRaw.map((item) => [item._id, item]));
  const normalizedDailySales = [];
  let cursor = new Date(start);
  while (cursor <= end) {
    const key = (() => {
      if (granularity === "month") return cursor.toISOString().slice(0, 7);
      if (granularity === "week") {
        const temp = new Date(cursor);
        const dayNum = (temp.getUTCDay() + 6) % 7;
        temp.setUTCDate(temp.getUTCDate() + 3 - dayNum);
        const isoYear = temp.getUTCFullYear();
        const yearStart = new Date(Date.UTC(isoYear, 0, 4));
        const weekNo = Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
        return `${isoYear}-W${String(weekNo).padStart(2, "0")}`;
      }
      return cursor.toISOString().slice(0, 10);
    })();

    const row = bucketMap.get(key);
    normalizedDailySales.push({
      _id: key,
      revenue: row?.revenue || 0,
      orders: row?.orders || 0,
    });
    cursor.setDate(cursor.getDate() + incrementDays);
  }

  const summary = salesSummary[0] || { totalRevenue: 0, paidOrders: 0 };
  const totalOrdersInRange = paymentStatusStats.reduce((acc, item) => acc + item.count, 0);
  const averageOrderValue = summary.paidOrders > 0 ? summary.totalRevenue / summary.paidOrders : 0;
  const paidRate = totalOrdersInRange > 0 ? (summary.paidOrders / totalOrdersInRange) * 100 : 0;

  let previousPeriod = null;
  if (comparePrevious) {
    const rangeMs = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - rangeMs);
    const [prevSummaryRaw, prevStatusRaw] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: { $gte: prevStart, $lte: prevEnd },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            paidOrders: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: prevStart, $lte: prevEnd } } },
        { $group: { _id: null, total: { $sum: 1 } } },
      ]),
    ]);

    const prevSummary = prevSummaryRaw[0] || { totalRevenue: 0, paidOrders: 0 };
    const prevTotalOrders = prevStatusRaw[0]?.total || 0;
    const prevAov = prevSummary.paidOrders > 0 ? prevSummary.totalRevenue / prevSummary.paidOrders : 0;
    const prevPaidRate = prevTotalOrders > 0 ? (prevSummary.paidOrders / prevTotalOrders) * 100 : 0;

    previousPeriod = {
      start: prevStart.toISOString(),
      end: prevEnd.toISOString(),
      totalRevenue: prevSummary.totalRevenue,
      paidOrders: prevSummary.paidOrders,
      averageOrderValue: prevAov,
      paidRate: prevPaidRate,
      deltaRevenue: summary.totalRevenue - prevSummary.totalRevenue,
      deltaOrders: summary.paidOrders - prevSummary.paidOrders,
      deltaAverageOrderValue: averageOrderValue - prevAov,
      deltaPaidRate: paidRate - prevPaidRate,
    };
  }

  res.json({
    success: true,
    data: {
      filters: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        granularity,
        topLimit,
        tz,
        comparePrevious: Boolean(comparePrevious),
      },
      summary: {
        totalRevenue: summary.totalRevenue,
        paidOrders: summary.paidOrders,
        totalOrdersInRange,
        averageOrderValue,
        paidRate,
      },
      previousPeriod,
      dailySales: normalizedDailySales,
      topProducts,
      categorySales,
      paymentStatusStats,
      lowStockCount,
      openSupportCount,
    },
  });
});

exports.getStoreSettings = asyncHandler(async (_req, res) => {
  let settings = await StoreSettings.findOne().lean();
  if (!settings) {
    settings = (await StoreSettings.create({})).toObject();
  }
  res.json({ success: true, data: settings });
});

exports.updateStoreSettings = asyncHandler(async (req, res) => {
  let settings = await StoreSettings.findOne();
  if (!settings) {
    settings = new StoreSettings({});
  }
  Object.assign(settings, req.body);
  await settings.save();
  res.json({ success: true, data: settings });
});

exports.getSupportMessages = asyncHandler(async (req, res) => {
  const { page, limit, search, status } = req.query;
  const skip = (page - 1) * limit;
  const filter = {};
  if (status === "open" || status === "in_progress" || status === "resolved") {
    filter.adminStatus = status;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "resolvedBy", select: "firstName lastName email" })
      .lean(),
    ContactMessage.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

exports.updateSupportMessageStatus = asyncHandler(async (req, res) => {
  const payload = {
    adminStatus: req.body.adminStatus,
  };
  if (req.body.adminStatus === "resolved") {
    payload.resolvedAt = new Date();
    payload.resolvedBy = req.user.id;
  } else {
    payload.resolvedAt = null;
    payload.resolvedBy = null;
  }
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!message) throw new ApiError(404, "Mesaj bulunamadı", true);
  res.json({ success: true, data: message });
});
