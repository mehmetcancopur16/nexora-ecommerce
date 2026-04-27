const express = require("express");
const notificationController = require("../controllers/notification.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validateBody, validateParams } = require("../middlewares/validate.middleware");
const {
  notificationIdParamSchema,
  notificationPreferencesSchema,
} = require("../validations/notification.validation");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Kullanıcının bildirimlerini listeler
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bildirimler getirildi
 *       401:
 *         description: Yetkisiz
 */
router.get("/", notificationController.getMyNotifications);
/**
 * @openapi
 * /api/notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Bildirimi okundu olarak işaretler
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bildirim güncellendi
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Bildirim bulunamadı
 */
router.patch(
  "/:id/read",
  validateParams(notificationIdParamSchema),
  notificationController.markAsRead
);
/**
 * @openapi
 * /api/notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Tüm bildirimleri okundu olarak işaretler
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bildirimler güncellendi
 *       401:
 *         description: Yetkisiz
 */
router.patch("/read-all", notificationController.markAllAsRead);
/**
 * @openapi
 * /api/notifications/preferences:
 *   get:
 *     tags: [Notifications]
 *     summary: Kullanıcının bildirim tercihlerini getirir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tercihler getirildi
 *       401:
 *         description: Yetkisiz
 */
router.get("/preferences", notificationController.getMyNotificationPreferences);
/**
 * @openapi
 * /api/notifications/preferences:
 *   patch:
 *     tags: [Notifications]
 *     summary: Kullanıcının bildirim tercihlerini günceller
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationPreferences'
 *     responses:
 *       200:
 *         description: Tercihler güncellendi
 *       400:
 *         description: Geçersiz veri
 *       401:
 *         description: Yetkisiz
 */
router.patch(
  "/preferences",
  validateBody(notificationPreferencesSchema),
  notificationController.updateMyNotificationPreferences
);

module.exports = router;
