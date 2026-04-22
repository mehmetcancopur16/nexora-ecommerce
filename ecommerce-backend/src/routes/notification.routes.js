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

router.get("/", notificationController.getMyNotifications);
router.patch(
  "/:id/read",
  validateParams(notificationIdParamSchema),
  notificationController.markAsRead
);
router.patch("/read-all", notificationController.markAllAsRead);
router.get("/preferences", notificationController.getMyNotificationPreferences);
router.patch(
  "/preferences",
  validateBody(notificationPreferencesSchema),
  notificationController.updateMyNotificationPreferences
);

module.exports = router;
