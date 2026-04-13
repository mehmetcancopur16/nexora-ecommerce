const mongoose = require("mongoose");
const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

exports.getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  let cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name price stock images isActive category",
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  res.json({ success: true, data: cart });
});

exports.addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const product = await Product.findOne({ _id: productId, isActive: true }).select("_id stock");
  if (!product) {
    throw new ApiError(404, "Ürün bulunamadı", true);
  }

  if (quantity > product.stock) {
    throw new ApiError(409, "İstenen adet stoktan fazla", true);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => String(item.product) === String(productId)
  );

  if (itemIndex >= 0) {
    const newQty = cart.items[itemIndex].quantity + quantity;
    if (newQty > product.stock) {
      throw new ApiError(409, "Toplam adet stoktan fazla", true);
    }
    cart.items[itemIndex].quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate({
    path: "items.product",
    select: "name price stock images isActive category",
  });

  res.status(200).json({ success: true, data: cart });
});

exports.updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Geçersiz ürün kimliği", true);
  }

  const product = await Product.findOne({ _id: productId, isActive: true }).select("_id stock");
  if (!product) {
    throw new ApiError(404, "Ürün bulunamadı", true);
  }

  if (quantity > product.stock) {
    throw new ApiError(409, "İstenen adet stoktan fazla", true);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Sepet bulunamadı", true);
  }

  const itemIndex = cart.items.findIndex(
    (item) => String(item.product) === String(productId)
  );

  if (itemIndex < 0) {
    throw new ApiError(404, "Ürün sepette bulunamadı", true);
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  await cart.populate({
    path: "items.product",
    select: "name price stock images isActive category",
  });

  res.json({ success: true, data: cart });
});

exports.removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Geçersiz ürün kimliği", true);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Sepet bulunamadı", true);
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    (item) => String(item.product) !== String(productId)
  );

  if (cart.items.length === initialLength) {
    throw new ApiError(404, "Ürün sepette bulunamadı", true);
  }

  await cart.save();
  await cart.populate({
    path: "items.product",
    select: "name price stock images isActive category",
  });

  res.json({ success: true, data: cart });
});
