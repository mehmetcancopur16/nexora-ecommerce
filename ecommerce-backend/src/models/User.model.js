const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const normalizePhone = (value) => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().replace(/[\s()-]/g, "");
};

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "Ev" },
    city: { type: String, trim: true, default: "" },
    district: { type: String, trim: true, default: "" },
    postalCode: { type: String, trim: true, default: "" },
    openAddress: { type: String, trim: true, default: "" },
    // Legacy fields (migrated or mirrored)
    street: { type: String, trim: true, default: "" },
    zip: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "Türkiye" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const notificationPreferencesSchema = new mongoose.Schema(
  {
    orderUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    securityAlerts: { type: Boolean, default: true },
    productNews: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    phone: { type: String, default: "", set: normalizePhone },
    address: { type: addressSchema, default: () => ({}) },
    addresses: { type: [addressSchema], default: [] },
    notificationPreferences: { type: notificationPreferencesSchema, default: () => ({}) },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    lastPasswordChangeAt: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null, select: false },
    resetPasswordExpiresAt: { type: Date, default: null, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("name").get(function getName() {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $type: "string", $ne: "" },
    },
  }
);

userSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.matchPassword = async function matchPassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
