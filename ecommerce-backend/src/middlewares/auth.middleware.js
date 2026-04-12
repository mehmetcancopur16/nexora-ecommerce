const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

function authMiddleware(req, res, next) {
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

    req.user = {
      id: String(id),
      role: String(role),
      email: payload.email,
    };
    return next();
  } catch {
    return next(new ApiError(401, "Geçersiz veya süresi dolmuş token", true));
  }
}

module.exports = { authMiddleware };
