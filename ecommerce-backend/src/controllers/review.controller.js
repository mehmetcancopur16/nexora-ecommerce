const mongoose = require("mongoose");
const Review = require("../models/Review.model");
const Order = require("../models/Order.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

exports.createReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { product, rating, comment } = req.body;

  const hasPurchased = await Order.exists({
    user: userId,
    "items.product": product,
    status: { $in: ["pending", "processing", "shipped", "delivered"] },
  });

  if (!hasPurchased) {
    throw new ApiError(403, "Yorum yapabilmek için ürünü satın almış olmalısınız", true);
  }

  const review = await Review.create({
    user: userId,
    product,
    rating,
    comment,
  });

  await review.populate([
    { path: "user", select: "firstName lastName email role" },
    { path: "product", select: "name averageRating numOfReviews" },
  ]);

  res.status(201).json({ success: true, data: review });
});

exports.getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Geçersiz ürün kimliği", true);
  }

  const reviews = await Review.find({ product: productId })
    .sort({ createdAt: -1 })
    .populate({ path: "user", select: "firstName lastName role" });

  res.json({ success: true, data: reviews });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Geçersiz yorum kimliği", true);
  }

  const review = await Review.findById(id);

  if (!review) {
    throw new ApiError(404, "Yorum bulunamadı", true);
  }

  const isOwner = String(review.user) === String(req.user.id);
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "Bu yorumu silme yetkiniz yok", true);
  }

  await Review.findOneAndDelete({ _id: id });

  res.json({
    success: true,
    message: "Yorum başarıyla silindi",
  });
});
