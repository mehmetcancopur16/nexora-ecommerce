const User = require("../models/User.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

exports.getDashboardStats = asyncHandler(async (_req, res) => {
  const [userCount, orderStats, statusDistribution, lowStockProducts] = await Promise.all([
    User.countDocuments(),
    Order.aggregate([
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
  ]);

  res.json({
    success: true,
    data: {
      totalUsers: userCount,
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalRevenue: orderStats[0]?.totalRevenue || 0,
      orderStatusDistribution: statusDistribution,
      lowStockProducts,
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
      { name: { $regex: search, $options: "i" } },
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
