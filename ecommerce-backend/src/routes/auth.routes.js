const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/auth.controller");
const { validateBody } = require("../middlewares/validate.middleware");
const {
  loginBodySchema,
  registerBodySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validations/auth.validation");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Çok fazla giriş veya kayıt denemesi. Lütfen daha sonra tekrar deneyin.",
  },
});

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Yeni kullanıcı kaydı
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *               - confirmPassword
 *               - privacyConsent
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 60
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 60
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 320
 *               phone:
 *                 type: string
 *                 description: Uluslararası format (ör. +905551234567)
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 128
 *               confirmPassword:
 *                 type: string
 *                 minLength: 8
 *               privacyConsent:
 *                 type: boolean
 *                 enum: [true]
 *     responses:
 *       201:
 *         description: Kayıt başarılı, JWT döner
 *       400:
 *         description: Geçersiz veri
 *       409:
 *         description: E-posta veya telefon kullanımda
 */
router.post("/register", authLimiter, validateBody(registerBodySchema), authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Giriş (JWT)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               loginType:
 *                 type: string
 *                 enum: [email, phone]
 *                 description: Opsiyonel; belirtilmezse identifier e-posta mı telefon mu otomatik algılanır
 *               identifier:
 *                 type: string
 *                 description: E-posta veya telefon (ör. +905551234567)
 *               password:
 *                 type: string
 *                 maxLength: 128
 *     responses:
 *       200:
 *         description: Başarılı, JWT döner
 *       401:
 *         description: Kimlik doğrulama başarısız
 */
router.post("/login", authLimiter, validateBody(loginBodySchema), authController.login);
router.post("/forgot-password", authLimiter, validateBody(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", authLimiter, validateBody(resetPasswordSchema), authController.resetPassword);

module.exports = router;
