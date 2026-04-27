const express = require("express");
const rateLimit = require("express-rate-limit");
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validateBody, validateParams } = require("../middlewares/validate.middleware");
const {
  updateProfileSchema,
  updatePasswordSchema,
  wishlistParamSchema,
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Yetkisiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Yetkisiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Ürün veya kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/wishlist/:productId",
  validateParams(wishlistParamSchema),
  userController.toggleWishlist
);

/**
 * @openapi
 * /api/users/addresses:
 *   get:
 *     tags: [Users]
 *     summary: Kullanıcının kayıtlı adreslerini listeler
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 *       401:
 *         description: Yetkisiz
 */
router.get("/addresses", userController.getAddresses);
/**
 * @openapi
 * /api/users/addresses:
 *   post:
 *     tags: [Users]
 *     summary: Yeni adres ekler
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressCreate'
 *     responses:
 *       201:
 *         description: Adres eklendi
 *       400:
 *         description: Geçersiz veri
 *       401:
 *         description: Yetkisiz
 */
router.post("/addresses", validateBody(createAddressSchema), userController.addAddress);
/**
 * @openapi
 * /api/users/addresses/{addressId}:
 *   patch:
 *     tags: [Users]
 *     summary: Adres bilgilerini günceller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressUpdate'
 *     responses:
 *       200:
 *         description: Adres güncellendi
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Adres bulunamadı
 */
router.patch(
  "/addresses/:addressId",
  validateParams(addressIdParamSchema),
  validateBody(updateAddressSchema),
  userController.updateAddress
);
/**
 * @openapi
 * /api/users/addresses/{addressId}:
 *   delete:
 *     tags: [Users]
 *     summary: Adres siler
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Adres silindi
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Adres bulunamadı
 */
router.delete(
  "/addresses/:addressId",
  validateParams(addressIdParamSchema),
  userController.deleteAddress
);
/**
 * @openapi
 * /api/users/addresses/{addressId}/default:
 *   patch:
 *     tags: [Users]
 *     summary: Varsayılan adresi günceller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Varsayılan adres güncellendi
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Adres bulunamadı
 */
router.patch(
  "/addresses/:addressId/default",
  validateParams(addressIdParamSchema),
  userController.setDefaultAddress
);

module.exports = router;
