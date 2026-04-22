const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    city: { type: String, trim: true, default: "" },
    district: { type: String, trim: true, default: "" },
    postalCode: { type: String, trim: true, default: "" },
    openAddress: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "Türkiye" },
    // Legacy
    street: { type: String, trim: true, default: "" },
    zip: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending_payment", "paid", "failed"],
      default: "pending_payment",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["mock_card", "bank_transfer", "cash_on_delivery"],
      default: "mock_card",
      required: true,
    },
    transactionRef: { type: String, trim: true, default: null },
    paidAt: { type: Date, default: null },
    orderNumber: { type: String, required: true, unique: true, index: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    customer: { type: customerSchema, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
