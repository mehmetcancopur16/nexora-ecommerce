const User = require("../models/User.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { signUserToken } = require("../utils/token.util");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizePhone = (value) => value.trim().replace(/[\s()-]/g, "");

exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  const existing = await User.findOne({
    $or: [{ email }, { phone: normalizePhone(phone) }],
  });
  if (existing) {
    throw new ApiError(409, "Bu e-posta veya telefon zaten kayıtlı", true);
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
  const { identifier, password, loginType } = req.body;
  const normalizedIdentifier = identifier.trim();

  let query;
  if (loginType === "email") {
    query = { email: normalizedIdentifier.toLowerCase() };
  } else if (loginType === "phone") {
    query = { phone: normalizePhone(normalizedIdentifier) };
  } else {
    const isEmailIdentifier = emailRegex.test(normalizedIdentifier);
    query = isEmailIdentifier
      ? { email: normalizedIdentifier.toLowerCase() }
      : { phone: normalizePhone(normalizedIdentifier) };
  }

  const user = await User.findOne(query).select("+password");
  if (!user) {
    throw new ApiError(401, "Giriş bilgileri hatalı", true);
  }

  if (!user.isActive) {
    throw new ApiError(403, "Hesabınız pasif durumda", true);
  }

  const match = await user.matchPassword(password);
  if (!match) {
    throw new ApiError(401, "Giriş bilgileri hatalı", true);
  }

  const token = signUserToken(user);
  const safe = await User.findById(user._id).select("-password");

  res.json({
    success: true,
    token,
    data: safe,
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select("+resetPasswordToken +resetPasswordExpiresAt");
  if (!user) {
    return res.json({
      success: true,
      message: "Eğer bu e-posta kayıtlıysa sıfırlama kodu gönderilecektir.",
    });
  }

  const resetToken = String(Math.floor(100000 + Math.random() * 900000));
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  res.json({
    success: true,
    message: "Şifre sıfırlama kodu oluşturuldu.",
    data: { resetToken }, // mock mode
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: { $gt: new Date() },
  }).select("+resetPasswordToken +resetPasswordExpiresAt +password");

  if (!user) {
    throw new ApiError(400, "Sıfırlama kodu geçersiz veya süresi dolmuş", true);
  }

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpiresAt = null;
  user.lastPasswordChangeAt = new Date();
  await user.save();

  res.json({
    success: true,
    message: "Şifreniz başarıyla sıfırlandı",
  });
});
