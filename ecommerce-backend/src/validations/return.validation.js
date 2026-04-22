const { z } = require("zod");

const objectIdSchema = z
  .string()
  .length(24, "Geçersiz ObjectId")
  .regex(/^[a-fA-F0-9]{24}$/, "Geçersiz ObjectId");

const returnItemSchema = z.object({
  orderItemId: z.string().trim().min(1, "Sipariş kalemi zorunlu"),
  quantity: z.number().int().min(1, "Adet en az 1 olmalı"),
  reason: z.string().trim().min(4, "İade sebebi en az 4 karakter olmalı"),
});

const createReturnSchema = z.object({
  orderId: objectIdSchema,
  items: z.array(returnItemSchema).min(1, "En az bir ürün seçmelisiniz"),
  note: z.string().trim().max(400).optional(),
});

const updateReturnStatusSchema = z.object({
  status: z.enum(["requested", "approved", "rejected", "refunded"]),
});

const returnIdParamSchema = z.object({
  id: objectIdSchema,
});

module.exports = {
  createReturnSchema,
  updateReturnStatusSchema,
  returnIdParamSchema,
};
