const User = require("../models/User.model");
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

  if (req.body.name !== undefined) {
    user.name = req.body.name;
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
