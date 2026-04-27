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
 *       403:
 *         description: Hesap pasif veya erişime kapalı
 */
router.post("/login", authLimiter, validateBody(loginBodySchema), authController.login);
/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Şifre sıfırlama bağlantısı gönderir
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: E-posta gönderim süreci başlatıldı
 *       400:
 *         description: Geçersiz veri
 */
router.post("/forgot-password", authLimiter, validateBody(forgotPasswordSchema), authController.forgotPassword);
/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Token ile şifre sıfırlar
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password, confirmPassword]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: En az 1 büyük, 1 küçük harf ve 1 rakam içermelidir
 *               confirmPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Şifre güncellendi
 *       400:
 *         description: Geçersiz token veya veri
 */
router.post("/reset-password", authLimiter, validateBody(resetPasswordSchema), authController.resetPassword);

module.exports = router;
