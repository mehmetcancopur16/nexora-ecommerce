const Notification = require("../models/Notification.model");
const User = require("../models/User.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

exports.getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, data: notifications });
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  if (!notification) {
    throw new ApiError(404, "Bildirim bulunamadı", true);
  }
  res.json({ success: true, data: notification });
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
  res.json({ success: true, message: "Tüm bildirimler okundu olarak işaretlendi" });
});

exports.getMyNotificationPreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("notificationPreferences");
  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }
  res.json({ success: true, data: user.notificationPreferences || {} });
});

exports.updateMyNotificationPreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("notificationPreferences");
  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }
  user.notificationPreferences = {
    ...user.notificationPreferences?.toObject?.(),
    ...req.body,
  };
  await user.save();
  res.json({ success: true, data: user.notificationPreferences });
});
