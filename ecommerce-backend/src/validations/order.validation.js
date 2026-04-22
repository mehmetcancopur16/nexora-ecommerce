const { z } = require("zod");

const objectIdSchema = z
  .string()
  .length(24, "Geçersiz ObjectId")
  .regex(/^[a-fA-F0-9]{24}$/, "Geçersiz ObjectId");

const orderStatusEnum = z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]);
const paymentStatusEnum = z.enum(["pending_payment", "paid", "failed"]);

const shippingAddressSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(1, "Sokak bilgisi zorunlu").trim(),
    city: z.string().min(1, "Şehir bilgisi zorunlu").trim(),
    zip: z.string().min(1, "Posta kodu zorunlu").trim(),
    country: z.string().min(1, "Ülke bilgisi zorunlu").trim(),
  }),
});

const customerSchema = z.object({
  customer: z.object({
    firstName: z.string().min(2, "Ad en az 2 karakter olmalı").trim(),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalı").trim(),
    email: z.string().email("Geçerli bir e-posta giriniz").trim(),
    phone: z.string().min(10, "Telefon numarası en az 10 karakter olmalı").trim(),
  }),
});

const createOrderSchema = shippingAddressSchema.merge(customerSchema);

const paymentMethodEnum = z.enum(["mock_card", "bank_transfer", "cash_on_delivery"]);

const mockCardSchema = z.object({
  holderName: z.string().min(3, "Kart sahibi adı zorunlu").trim(),
  number: z.string().regex(/^\d{16}$/, "Kart numarası 16 haneli olmalı"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Son kullanma tarihi MM/YY formatında olmalı"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC 3 veya 4 haneli olmalı"),
});

const payMockOrderSchema = z.object({
  paymentMethod: paymentMethodEnum,
  mockCard: mockCardSchema.optional(),
});

const createOrderDraftSchema = createOrderSchema.extend({
  paymentMethod: paymentMethodEnum.default("mock_card"),
});

const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
});

const orderIdParamSchema = z.object({
  id: objectIdSchema,
});

module.exports = {
  createOrderSchema: createOrderDraftSchema,
  payMockOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
  orderStatusEnum,
  paymentStatusEnum,
  paymentMethodEnum,
};
