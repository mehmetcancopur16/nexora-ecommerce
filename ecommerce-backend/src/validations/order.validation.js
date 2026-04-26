const { z } = require("zod");

const objectIdSchema = z
  .string()
  .length(24, "Geçersiz ObjectId")
  .regex(/^[a-fA-F0-9]{24}$/, "Geçersiz ObjectId");

const orderStatusEnum = z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]);
const paymentStatusEnum = z.enum(["pending_payment", "paid", "failed"]);

const shippingAddressSchema = z.object({
  shippingAddress: z.object({
    city: z.string().min(1, "İl zorunlu").trim(),
    district: z.string().min(1, "İlçe zorunlu").trim(),
    postalCode: z.string().min(1, "Posta kodu zorunlu").trim().max(10),
    openAddress: z.string().min(5, "Açık adres en az 5 karakter").trim().max(500),
    country: z.string().min(1, "Ülke zorunlu").trim().default("Türkiye"),
    street: z.string().trim().max(200).optional(),
    zip: z.string().trim().max(20).optional(),
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

const adminOrdersQuerySchema = z.object({
  page: z.preprocess((val) => {
    if (val === undefined || val === "") return 1;
    const n = Number(val);
    return Number.isFinite(n) ? n : 1;
  }, z.number().int().min(1)),
  limit: z.preprocess((val) => {
    if (val === undefined || val === "") return 20;
    const n = Number(val);
    return Number.isFinite(n) ? n : 20;
  }, z.number().int().min(1).max(100)),
  search: z.preprocess((val) => (typeof val === "string" ? val.trim() : val), z.string().optional()),
  status: orderStatusEnum.optional(),
  paymentStatus: paymentStatusEnum.optional(),
});

const orderIdParamSchema = z.object({
  id: objectIdSchema,
});

module.exports = {
  createOrderSchema: createOrderDraftSchema,
  payMockOrderSchema,
  updateOrderStatusSchema,
  adminOrdersQuerySchema,
  orderIdParamSchema,
  orderStatusEnum,
  paymentStatusEnum,
  paymentMethodEnum,
};
