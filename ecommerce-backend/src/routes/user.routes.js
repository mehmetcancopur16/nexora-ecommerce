const express = require("express");
const rateLimit = require("express-rate-limit");
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validateBody, validateParams } = require("../middlewares/validate.middleware");
const {
  updateProfileSchema,
  updatePasswordSchema,
  wishlistParamSchema,
} = require("../validations/user.validation");

const router = express.Router();

const sensitiveUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Bu endpoint için çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.",
  },
});

router.use(authMiddleware);

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Giriş yapmış kullanıcının profilini getir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.get("/me", userController.getMe);

/**
 * @openapi
 * /api/users/profile:
 *   patch:
 *     tags: [Users]
 *     summary: Kullanıcı profil bilgilerini güncelle
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdate'
 *     responses:
 *       200:
 *         description: Profil güncellendi
 *       400:
 *         description: Geçersiz veri
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.patch(
  "/profile",
  sensitiveUserLimiter,
  validateBody(updateProfileSchema),
  userController.updateProfile
);

/**
 * @openapi
 * /api/users/password:
 *   patch:
 *     tags: [Users]
 *     summary: Kullanıcı şifresini güncelle
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordUpdate'
 *     responses:
 *       200:
 *         description: Şifre güncellendi
 *       400:
 *         description: Mevcut şifre hatalı veya geçersiz veri
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.patch(
  "/password",
  sensitiveUserLimiter,
  validateBody(updatePasswordSchema),
  userController.updatePassword
);

/**
 * @openapi
 * /api/users/wishlist:
 *   get:
 *     tags: [Users]
 *     summary: Kullanıcının favori ürünlerini getir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favoriler başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishlistResponse'
 *       401:
 *         description: Yetkisiz
 */
router.get("/wishlist", userController.getWishlist);

/**
 * @openapi
 * /api/users/wishlist/{productId}:
 *   patch:
 *     tags: [Users]
 *     summary: Favori ürün durumunu değiştir (ekle/çıkar)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: Ürün ObjectId
 *     responses:
 *       200:
 *         description: Favori durumu güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishlistResponse'
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Ürün veya kullanıcı bulunamadı
 */
router.patch(
  "/wishlist/:productId",
  validateParams(wishlistParamSchema),
  userController.toggleWishlist
);

module.exports = router;
