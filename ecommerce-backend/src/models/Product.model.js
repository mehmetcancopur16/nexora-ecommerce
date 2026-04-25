const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    sku: { type: String, trim: true },
    price: { type: Number, min: 0 },
    stock: { type: Number, min: 0, default: 0 },
    images: [{ type: String }],
  },
  { _id: false }
);

const specSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const metadataSchema = new mongoose.Schema(
  {
    material: { type: String, trim: true, default: "" },
    dimensions: { type: String, trim: true, default: "" },
    weight: { type: String, trim: true, default: "" },
    countryOfOrigin: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const shippingInfoSchema = new mongoose.Schema(
  {
    estimatedDeliveryDays: { type: Number, min: 0, default: 0 },
    freeShippingThreshold: { type: Number, min: 0, default: 0 },
    shippingProvider: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    canonicalUrl: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    sku: { type: String, trim: true, uppercase: true },
    brand: { type: String, trim: true, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [{ type: String }],
    tags: [{ type: String, trim: true, lowercase: true }],
    specs: { type: [specSchema], default: [] },
    variants: { type: [variantSchema], default: [] },
    metadata: { type: metadataSchema, default: () => ({}) },
    shippingInfo: { type: shippingInfoSchema, default: () => ({}) },
    warrantyInfo: { type: String, default: "" },
    returnPolicySnippet: { type: String, default: "" },
    seo: { type: seoSchema, default: () => ({}) },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    numOfReviews: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre("validate", function autoSlugify(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

productSchema.index({ name: "text" });
productSchema.index({ name: 1 });
productSchema.index({ slug: 1 }, { unique: true, sparse: true });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model("Product", productSchema);
