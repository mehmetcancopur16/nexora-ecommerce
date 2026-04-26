const { z } = require("zod");

const objectIdString = z
  .string()
  .length(24, "Geçersiz ObjectId")
  .regex(/^[a-fA-F0-9]{24}$/, "Geçersiz ObjectId");

const specSchema = z.object({
  key: z.string().min(1).trim(),
  value: z.string().min(1).trim(),
});

const variantSchema = z.object({
  name: z.string().min(1).trim(),
  value: z.string().min(1).trim(),
  sku: z.string().trim().optional(),
  price: z.number().nonnegative("Varyant fiyati negatif olamaz").optional(),
  stock: z.number().int().min(0, "Varyant stogu negatif olamaz").optional(),
  images: z.array(z.string().min(1)).optional(),
});

const metadataSchema = z
  .object({
    material: z.string().trim().optional(),
    dimensions: z.string().trim().optional(),
    weight: z.string().trim().optional(),
    countryOfOrigin: z.string().trim().optional(),
  })
  .optional();

const shippingInfoSchema = z
  .object({
    estimatedDeliveryDays: z.number().int().min(0).optional(),
    freeShippingThreshold: z.number().nonnegative().optional(),
    shippingProvider: z.string().trim().optional(),
  })
  .optional();

const seoSchema = z
  .object({
    metaTitle: z.string().trim().optional(),
    metaDescription: z.string().trim().optional(),
    canonicalUrl: z.string().trim().optional(),
  })
  .optional();

const createProductSchema = z.object({
  name: z.string().min(1).trim(),
  slug: z.string().min(1).trim().optional(),
  sku: z.string().min(1).trim().optional(),
  brand: z.string().trim().optional(),
  description: z.string().optional(),
  price: z.number().positive("Fiyat pozitif olmalıdır"),
  stock: z.number().int().min(0, "Stok negatif olamaz"),
  category: objectIdString,
  images: z.array(z.string().min(1)).optional(),
  tags: z.array(z.string().min(1).trim()).optional(),
  specs: z.array(specSchema).optional(),
  variants: z.array(variantSchema).optional(),
  metadata: metadataSchema,
  shippingInfo: shippingInfoSchema,
  warrantyInfo: z.string().optional(),
  returnPolicySnippet: z.string().optional(),
  seo: seoSchema,
  isActive: z.boolean().optional(),
});

const updateProductSchema = z
  .object({
    name: z.string().min(1).trim().optional(),
    slug: z.string().min(1).trim().optional(),
    sku: z.string().min(1).trim().optional(),
    brand: z.string().trim().optional(),
    description: z.string().optional(),
    price: z.number().positive("Fiyat pozitif olmalıdır").optional(),
    stock: z.number().int().min(0, "Stok negatif olamaz").optional(),
    category: objectIdString.optional(),
    images: z.array(z.string().min(1)).optional(),
    tags: z.array(z.string().min(1).trim()).optional(),
    specs: z.array(specSchema).optional(),
    variants: z.array(variantSchema).optional(),
    metadata: metadataSchema,
    shippingInfo: shippingInfoSchema,
    warrantyInfo: z.string().optional(),
    returnPolicySnippet: z.string().optional(),
    seo: seoSchema,
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Güncelleme için en az bir alan gerekli",
  });

const sortEnum = z.enum(["newest", "price_asc", "price_desc", "name_asc", "name_desc", "relevance"]);

const listProductsQuerySchema = z.object({
  page: z.preprocess((val) => {
    if (val === undefined || val === "") return 1;
    const n = Number(val);
    return Number.isFinite(n) ? n : 1;
  }, z.number().int().min(1)),
  limit: z.preprocess((val) => {
    if (val === undefined || val === "") return 10;
    const n = Number(val);
    return Number.isFinite(n) ? n : 10;
  }, z.number().int().min(1).max(100)),
  category: objectIdString.optional(),
  search: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().optional()
  ),
  startsWith: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().min(1).max(64).optional()
  ),
  sort: z.preprocess((val) => {
    if (val === undefined || val === "") return undefined;
    if (typeof val !== "string") return undefined;
    const v = val.toLowerCase();
    const allowed = ["newest", "price_asc", "price_desc", "name_asc", "name_desc", "relevance"];
    return allowed.includes(v) ? v : undefined;
  }, sortEnum.optional()),
  includeInactive: z.preprocess((val) => {
    if (val === undefined || val === "") return false;
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
      return val.toLowerCase() === "true";
    }
    return false;
  }, z.boolean().optional()),
  active: z.preprocess((val) => {
    if (val === undefined || val === "") return undefined;
    if (typeof val !== "string") return undefined;
    const normalized = val.toLowerCase();
    if (normalized === "all" || normalized === "active" || normalized === "inactive") return normalized;
    return undefined;
  }, z.enum(["all", "active", "inactive"]).optional()),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
};
