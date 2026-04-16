const { z } = require("zod");

const objectIdString = z
  .string()
  .length(24, "Geçersiz ObjectId")
  .regex(/^[a-fA-F0-9]{24}$/, "Geçersiz ObjectId");

const createProductSchema = z.object({
  name: z.string().min(1).trim(),
  description: z.string().optional(),
  price: z.number().positive("Fiyat pozitif olmalıdır"),
  stock: z.number().int().min(0, "Stok negatif olamaz"),
  category: objectIdString,
  images: z.array(z.string().min(1)).optional(),
  isActive: z.boolean().optional(),
});

const updateProductSchema = z
  .object({
    name: z.string().min(1).trim().optional(),
    description: z.string().optional(),
    price: z.number().positive("Fiyat pozitif olmalıdır").optional(),
    stock: z.number().int().min(0, "Stok negatif olamaz").optional(),
    category: objectIdString.optional(),
    images: z.array(z.string().min(1)).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Güncelleme için en az bir alan gerekli",
  });

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
  includeInactive: z.preprocess((val) => {
    if (val === undefined || val === "") return false;
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
      return val.toLowerCase() === "true";
    }
    return false;
  }, z.boolean().optional()),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
};
