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
    Product.find({ stock: { $lt: 10 }, isActive: true })
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

exports.getAdminCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: categories });
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

exports.getAdminReports = asyncHandler(async (_req, res) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const [dailySales, topProducts, categorySales, paymentStatusStats, lowStockCount, openSupportCount] =
    await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: "paid" } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            soldUnits: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          },
        },
        { $sort: { soldUnits: -1 } },
        { $limit: 8 },
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
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $group: {
            _id: "$category.name",
            count: { $sum: 1 },
            stockTotal: { $sum: "$stock" },
          },
        },
        { $sort: { count: -1 } },
      ]),
      Order.aggregate([
        { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
        { $project: { _id: 0, status: "$_id", count: 1 } },
      ]),
      Product.countDocuments({ isActive: true, stock: { $lt: 10 } }),
      ContactMessage.countDocuments({ adminStatus: { $in: ["open", "in_progress"] } }),
    ]);

  res.json({
    success: true,
    data: {
      dailySales,
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
