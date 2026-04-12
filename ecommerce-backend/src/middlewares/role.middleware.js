const ApiError = require("../utils/apiError");

function requireRoles(...allowedRoles) {
  return function roleMiddleware(req, res, next) {
    if (!req.user || !req.user.role) {
      return next(new ApiError(401, "Yetkilendirme gerekli", true));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Bu işlem için yetkiniz yok", true));
    }

    return next();
  };
}

module.exports = { requireRoles };
