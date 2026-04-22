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
