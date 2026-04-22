const PaymentMethod = require("../models/PaymentMethod.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

exports.getMyPaymentMethods = asyncHandler(async (req, res) => {
  const methods = await PaymentMethod.find({ user: req.user.id, isActive: true }).sort({
    isDefault: -1,
    createdAt: -1,
  });
  res.json({ success: true, data: methods });
});

exports.createPaymentMethod = asyncHandler(async (req, res) => {
  const payload = { ...req.body, user: req.user.id, provider: "tokenized" };

  if (payload.isDefault === undefined) {
    const hasMethod = await PaymentMethod.exists({ user: req.user.id, isActive: true });
    payload.isDefault = !hasMethod;
  }

  if (payload.isDefault) {
    await PaymentMethod.updateMany({ user: req.user.id }, { $set: { isDefault: false } });
  }

  const method = await PaymentMethod.create(payload);
  res.status(201).json({ success: true, data: method });
});

exports.deletePaymentMethod = asyncHandler(async (req, res) => {
  const existing = await PaymentMethod.findOne({ _id: req.params.id, user: req.user.id, isActive: true });
  if (!existing) {
    throw new ApiError(404, "Ödeme yöntemi bulunamadı", true);
  }
  const wasDefault = existing.isDefault;

  await PaymentMethod.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isActive: false, isDefault: false },
    { new: true }
  );

  if (wasDefault) {
    await PaymentMethod.updateMany({ user: req.user.id, isActive: true }, { $set: { isDefault: false } });
    const next = await PaymentMethod.findOne({ user: req.user.id, isActive: true }).sort({ createdAt: -1 });
    if (next) {
      next.isDefault = true;
      await next.save();
    }
  }

  res.json({ success: true, message: "Ödeme yöntemi silindi" });
});

exports.setDefaultPaymentMethod = asyncHandler(async (req, res) => {
  const method = await PaymentMethod.findOne({ _id: req.params.id, user: req.user.id, isActive: true });
  if (!method) {
    throw new ApiError(404, "Ödeme yöntemi bulunamadı", true);
  }

  await PaymentMethod.updateMany({ user: req.user.id }, { $set: { isDefault: false } });
  method.isDefault = true;
  await method.save();

  res.json({ success: true, data: method });
});
