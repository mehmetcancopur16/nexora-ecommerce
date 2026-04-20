const User = require("../models/User.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { signUserToken } = require("../utils/token.util");

exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "Bu e-posta adresi zaten kayıtlı", true);
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    role: "user",
  });

  const token = signUserToken(user);
  const safe = await User.findById(user._id).select("-password");

  res.status(201).json({
    success: true,
    token,
    data: safe,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "E-posta veya şifre hatalı", true);
  }

  if (!user.isActive) {
    throw new ApiError(403, "Hesabınız pasif durumda", true);
  }

  const match = await user.matchPassword(password);
  if (!match) {
    throw new ApiError(401, "E-posta veya şifre hatalı", true);
  }

  const token = signUserToken(user);
  const safe = await User.findById(user._id).select("-password");

  res.json({
    success: true,
    token,
    data: safe,
  });
});
