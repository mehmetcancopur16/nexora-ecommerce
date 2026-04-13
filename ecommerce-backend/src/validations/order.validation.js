const { z } = require("zod");

const objectIdSchema = z
  .string()
  .length(24, "Geçersiz ObjectId")
  .regex(/^[a-fA-F0-9]{24}$/, "Geçersiz ObjectId");

const orderStatusEnum = z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]);

const createOrderSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(1, "Sokak bilgisi zorunlu").trim(),
    city: z.string().min(1, "Şehir bilgisi zorunlu").trim(),
    zip: z.string().min(1, "Posta kodu zorunlu").trim(),
  }),
});

const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
});

const orderIdParamSchema = z.object({
  id: objectIdSchema,
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
  orderStatusEnum,
};
