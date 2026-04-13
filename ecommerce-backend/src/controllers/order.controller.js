const mongoose = require("mongoose");
const Cart = require("../models/Cart.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

exports.createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress } = req.body;

  const session = await mongoose.startSession();
  let createdOrder;

  try {
    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: userId }).session(session);

      if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Sepet boş", true);
      }

      const productIds = cart.items.map((item) => item.product);
      const products = await Product.find({ _id: { $in: productIds }, isActive: true })
        .session(session)
        .select("name price stock isActive");

      if (products.length !== cart.items.length) {
        throw new ApiError(400, "Sepette geçersiz veya pasif ürün var", true);
      }

      const productMap = new Map(products.map((p) => [String(p._id), p]));

      const orderItems = [];
      let totalAmount = 0;

      for (const cartItem of cart.items) {
        const product = productMap.get(String(cartItem.product));
        if (!product) {
          throw new ApiError(400, "Ürün bulunamadı", true);
        }

        if (product.stock < cartItem.quantity) {
          throw new ApiError(409, `${product.name} için stok yetersiz`, true);
        }

        const updated = await Product.findOneAndUpdate(
          {
            _id: product._id,
            stock: { $gte: cartItem.quantity },
            isActive: true,
          },
          { $inc: { stock: -cartItem.quantity } },
          { new: true, session }
        );

        if (!updated) {
          throw new ApiError(409, `${product.name} için stok yetersiz`, true);
        }

        const itemPrice = product.price;
        orderItems.push({
          product: product._id,
          quantity: cartItem.quantity,
          price: itemPrice,
        });
        totalAmount += itemPrice * cartItem.quantity;
      }

      const orderDocs = await Order.create(
        [
          {
            user: userId,
            items: orderItems,
            totalAmount,
            shippingAddress,
            status: "pending",
          },
        ],
        { session }
      );

      createdOrder = orderDocs[0];

      cart.items = [];
      await cart.save({ session });
    });
  } finally {
    await session.endSession();
  }

  const populatedOrder = await Order.findById(createdOrder._id)
    .populate({ path: "items.product", select: "name description images" })
    .populate({ path: "user", select: "email role name" });

  res.status(201).json({ success: true, data: populatedOrder });
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate({ path: "items.product", select: "name description images" });

  res.json({ success: true, data: orders });
});

exports.getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate({ path: "user", select: "email role name" })
    .populate({ path: "items.product", select: "name description images" });

  res.json({ success: true, data: orders });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Geçersiz sipariş kimliği", true);
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  )
    .populate({ path: "user", select: "email role name" })
    .populate({ path: "items.product", select: "name description images" });

  if (!order) {
    throw new ApiError(404, "Sipariş bulunamadı", true);
  }

  res.json({ success: true, data: order });
});
