const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const User = require("../models/User.model");

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new ApiError(401, "Yetkilendirme gerekli", true));
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return next(new ApiError(401, "Yetkilendirme gerekli", true));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new ApiError(500, "Sunucu yapılandırması eksik (JWT_SECRET)", false));
  }

  try {
    const payload = jwt.verify(token, secret);
    const id = payload.sub ?? payload.id ?? payload._id;
    const role = payload.role;

    if (!id || !role) {
      return next(new ApiError(401, "Geçersiz token içeriği", true));
    }

    const user = await User.findById(id).select("email role isActive");
    if (!user) {
      return next(new ApiError(401, "Kullanıcı bulunamadı", true));
    }
    if (!user.isActive) {
      return next(new ApiError(403, "Hesabınız pasif durumda", true));
    }

    req.user = {
      id: String(user._id),
      role: String(user.role || role),
      email: user.email || payload.email,
    };
    return next();
  } catch {
    return next(new ApiError(401, "Geçersiz veya süresi dolmuş token", true));
  }
}

module.exports = { authMiddleware };
