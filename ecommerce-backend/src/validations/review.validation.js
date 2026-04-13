const { z } = require("zod");

const objectIdSchema = z
  .string()
  .length(24, "Geçersiz ObjectId")
  .regex(/^[a-fA-F0-9]{24}$/, "Geçersiz ObjectId");

const createReviewSchema = z.object({
  product: objectIdSchema,
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

const reviewIdParamSchema = z.object({
  id: objectIdSchema,
});

const productIdParamSchema = z.object({
  productId: objectIdSchema,
});

module.exports = {
  createReviewSchema,
  reviewIdParamSchema,
  productIdParamSchema,
};
