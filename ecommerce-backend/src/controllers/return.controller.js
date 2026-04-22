const ReturnRequest = require("../models/ReturnRequest.model");
const Order = require("../models/Order.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

exports.createReturnRequest = asyncHandler(async (req, res) => {
  const { orderId, items, note } = req.body;
  const order = await Order.findOne({ _id: orderId, user: req.user.id }).select("_id items status");
  if (!order) {
    throw new ApiError(404, "Sipariş bulunamadı", true);
  }
  if (!["processing", "shipped", "delivered"].includes(order.status)) {
    throw new ApiError(400, "Bu sipariş için iade talebi oluşturulamaz", true);
  }

  const lineIds = new Set();
  (order.items || []).forEach((line) => {
    if (line?._id) {
      lineIds.add(String(line._id));
    }
    if (line?.product) {
      const productId = line.product?._id ? String(line.product._id) : String(line.product);
      lineIds.add(`product-${productId}`);
    }
  });
  for (const item of items) {
    if (!lineIds.has(String(item.orderItemId))) {
      throw new ApiError(400, "Geçersiz sipariş kalemi", true);
    }
  }

  const created = await ReturnRequest.create({
    user: req.user.id,
    order: orderId,
    items,
    note: note || "",
  });
  res.status(201).json({ success: true, data: created });
});

exports.getMyReturns = asyncHandler(async (req, res) => {
  const returns = await ReturnRequest.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate({ path: "order", select: "orderNumber status totalAmount createdAt" });
  res.json({ success: true, data: returns });
});

exports.getAllReturns = asyncHandler(async (_req, res) => {
  const returns = await ReturnRequest.find()
    .sort({ createdAt: -1 })
    .populate({ path: "user", select: "email firstName lastName" })
    .populate({ path: "order", select: "orderNumber status totalAmount createdAt" });
  res.json({ success: true, data: returns });
});

exports.updateReturnStatus = asyncHandler(async (req, res) => {
  const request = await ReturnRequest.findById(req.params.id);
  if (!request) {
    throw new ApiError(404, "İade talebi bulunamadı", true);
  }
  request.status = req.body.status;
  if (["approved", "rejected", "refunded"].includes(req.body.status)) {
    request.resolvedAt = new Date();
  }
  await request.save();
  res.json({ success: true, data: request });
});
