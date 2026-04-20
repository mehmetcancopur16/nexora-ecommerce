const User = require("../models/User.model");
const Product = require("../models/Product.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  res.json({ success: true, data: user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  if (req.body.firstName !== undefined) {
    user.firstName = req.body.firstName;
  }

  if (req.body.lastName !== undefined) {
    user.lastName = req.body.lastName;
  }

  if (req.body.phone !== undefined) {
    user.phone = req.body.phone;
  }

  if (req.body.address) {
    user.address = {
      ...user.address?.toObject?.(),
      ...req.body.address,
    };
  }

  await user.save();

  res.json({ success: true, data: user });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, "Mevcut şifre hatalı", true);
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: "Şifre başarıyla güncellendi",
  });
});

exports.getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("wishlist")
    .populate({
      path: "wishlist",
      select: "name price images stock averageRating numOfReviews isActive",
    });

  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  res.json({
    success: true,
    data: user.wishlist,
  });
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId, isActive: true }).select("_id");
  if (!product) {
    throw new ApiError(404, "Ürün bulunamadı", true);
  }

  const user = await User.findById(req.user.id).select("wishlist");

  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  const exists = user.wishlist.some((item) => String(item) === String(productId));

  if (exists) {
    user.wishlist = user.wishlist.filter((item) => String(item) !== String(productId));
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  await user.populate({
    path: "wishlist",
    select: "name price images stock averageRating numOfReviews isActive",
  });

  res.json({
    success: true,
    message: exists ? "Ürün favorilerden kaldırıldı" : "Ürün favorilere eklendi",
    data: user.wishlist,
  });
});
