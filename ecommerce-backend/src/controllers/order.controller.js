const mongoose = require("mongoose");
const Cart = require("../models/Cart.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const generateOrderNumber = () => `NXR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const generateTransactionRef = () => `MOCK-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const buildOrderDraftFromCart = async ({ userId, session, shippingAddress, customer, paymentMethod }) => {
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
        customer,
        paymentMethod,
        paymentStatus: "pending_payment",
        status: "pending",
        orderNumber: generateOrderNumber(),
      },
    ],
    { session }
  );

  return orderDocs[0];
};

exports.createDraftOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress, customer, paymentMethod } = req.body;
  const session = await mongoose.startSession();
  let createdOrder;

  try {
    await session.withTransaction(async () => {
      createdOrder = await buildOrderDraftFromCart({
        userId,
        session,
        shippingAddress,
        customer,
        paymentMethod: paymentMethod || "mock_card",
      });
    });
  } finally {
    await session.endSession();
  }

  const populatedOrder = await Order.findById(createdOrder._id)
    .populate({ path: "items.product", select: "name description images" })
    .populate({ path: "user", select: "email role firstName lastName" });

  res.status(201).json({ success: true, data: populatedOrder });
});

exports.createOrder = exports.createDraftOrder;

exports.payMockOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { paymentMethod } = req.body;

  const session = await mongoose.startSession();
  let paidOrder;

  try {
    await session.withTransaction(async () => {
      const order = await Order.findOne({ _id: id, user: userId }).session(session);

      if (!order) {
        throw new ApiError(404, "Sipariş bulunamadı", true);
      }

      if (order.paymentStatus === "paid") {
        throw new ApiError(409, "Bu sipariş zaten ödendi", true);
      }

      for (const item of order.items) {
        const updated = await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity },
            isActive: true,
          },
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );

        if (!updated) {
          throw new ApiError(409, "Bazı ürünlerde stok yetersiz. Lütfen sepetinizi güncelleyin.", true);
        }
      }

      order.paymentStatus = "paid";
      order.status = "processing";
      order.paymentMethod = paymentMethod || order.paymentMethod || "mock_card";
      order.transactionRef = generateTransactionRef();
      order.paidAt = new Date();
      await order.save({ session });

      const cart = await Cart.findOne({ user: userId }).session(session);
      if (cart) {
        cart.items = [];
        await cart.save({ session });
      }

      paidOrder = order;
    });
  } finally {
    await session.endSession();
  }

  const populatedOrder = await Order.findById(paidOrder._id)
    .populate({ path: "items.product", select: "name description images" })
    .populate({ path: "user", select: "email role firstName lastName" });

  res.json({ success: true, data: populatedOrder });
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate({ path: "items.product", select: "name description images" });

  res.json({ success: true, data: orders });
});

exports.getMyOrderById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const order = await Order.findOne({ _id: id, user: userId })
    .populate({ path: "items.product", select: "name description images" })
    .populate({ path: "user", select: "email role firstName lastName" });

  if (!order) {
    throw new ApiError(404, "Sipariş bulunamadı", true);
  }

  res.json({ success: true, data: order });
});

exports.getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate({ path: "user", select: "email role firstName lastName" })
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
    .populate({ path: "user", select: "email role firstName lastName" })
    .populate({ path: "items.product", select: "name description images" });

  if (!order) {
    throw new ApiError(404, "Sipariş bulunamadı", true);
  }

  res.json({ success: true, data: order });
});
