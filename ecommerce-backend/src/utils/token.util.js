const jwt = require("jsonwebtoken");

function signUserToken(user) {
  const secret =
    process.env.JWT_SECRET ||
    (process.env.NODE_ENV !== "production" ? "dev_jwt_secret_change_me" : undefined);
  if (!secret) {
    throw new Error("JWT_SECRET tanımlı değil");
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  const payload = {
    sub: String(user._id),
    id: String(user._id),
    role: user.role,
    email: user.email,
  };
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = { signUserToken };
