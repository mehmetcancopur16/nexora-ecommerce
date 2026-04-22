const { z } = require("zod");

const objectIdSchema = z
  .string()
  .length(24, "Geçersiz ObjectId")
  .regex(/^[a-fA-F0-9]{24}$/, "Geçersiz ObjectId");

const createPaymentMethodSchema = z.object({
  methodType: z.enum(["card", "bank_transfer"]).default("card"),
  holderName: z.string().trim().min(3, "Kart sahibi adı zorunlu"),
  brand: z.string().trim().min(1, "Kart markası zorunlu"),
  last4: z.string().trim().regex(/^\d{4}$/, "Son 4 hane geçersiz"),
  expiryMonth: z.number().int().min(1).max(12),
  expiryYear: z.number().int().min(new Date().getFullYear()),
  tokenRef: z.string().trim().min(8, "Token referansı zorunlu"),
});

const paymentMethodIdParamSchema = z.object({
  id: objectIdSchema,
});

module.exports = {
  createPaymentMethodSchema,
  paymentMethodIdParamSchema,
};
