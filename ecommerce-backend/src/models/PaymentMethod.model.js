const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ["mock", "tokenized"],
      default: "mock",
      required: true,
    },
    methodType: {
      type: String,
      enum: ["card", "bank_transfer"],
      default: "card",
      required: true,
    },
    holderName: { type: String, required: true, trim: true },
    brand: { type: String, trim: true, default: "VISA" },
    last4: { type: String, required: true, trim: true },
    expiryMonth: { type: Number, min: 1, max: 12 },
    expiryYear: { type: Number, min: 2024 },
    tokenRef: { type: String, trim: true, required: true },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

paymentMethodSchema.index({ user: 1, isDefault: 1 });

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
