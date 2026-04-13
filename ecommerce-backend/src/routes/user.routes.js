const express = require("express");
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validateBody } = require("../middlewares/validate.middleware");
const {
  updateProfileSchema,
  updatePasswordSchema,
} = require("../validations/user.validation");

const router = express.Router();

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
  validateBody(updatePasswordSchema),
  userController.updatePassword
);

module.exports = router;
