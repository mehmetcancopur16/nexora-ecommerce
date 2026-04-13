const { z } = require("zod");

const objectIdSchema = z
  .string()
  .length(24, "Geçersiz ObjectId")
  .regex(/^[a-fA-F0-9]{24}$/, "Geçersiz ObjectId");

const addToCartSchema = z.object({
  productId: objectIdSchema,
  quantity: z.coerce.number().int().min(1, "Miktar en az 1 olmalı"),
});

const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Miktar en az 1 olmalı"),
});

const cartItemParamSchema = z.object({
  productId: objectIdSchema,
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
  cartItemParamSchema,
};
