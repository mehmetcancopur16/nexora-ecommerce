const mongoose = require("mongoose");

const storeSettingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, trim: true, default: "Nexora" },
    supportEmail: { type: String, trim: true, lowercase: true, default: "" },
    supportPhone: { type: String, trim: true, default: "" },
    currency: { type: String, trim: true, uppercase: true, default: "TRY" },
    maintenanceMode: { type: Boolean, default: false },
    allowGuestCheckout: { type: Boolean, default: true },
    lowStockThreshold: { type: Number, min: 0, default: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);
