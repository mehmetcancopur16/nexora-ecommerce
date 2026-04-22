const { z } = require("zod");

const objectIdSchema = z
  .string()
  .length(24, "Geçersiz ObjectId")
  .regex(/^[a-fA-F0-9]{24}$/, "Geçersiz ObjectId");

const updateProfileSchema = z
  .object({
    firstName: z.string().trim().min(2, "Ad en az 2 karakter olmalı").max(60).optional(),
    lastName: z.string().trim().min(2, "Soyad en az 2 karakter olmalı").max(60).optional(),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s()-]{10,20}$/, "Geçerli bir telefon numarası girin")
      .optional(),
    address: z
      .object({
        city: z.string().trim().min(1).max(80).optional(),
        district: z.string().trim().min(1).max(80).optional(),
        postalCode: z.string().trim().min(1).max(10).optional(),
        openAddress: z.string().trim().min(1).max(500).optional(),
        street: z.string().trim().min(1).max(120).optional(),
        zip: z.string().trim().min(1).max(20).optional(),
        country: z.string().trim().min(1).max(80).optional(),
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Güncellenecek en az bir alan gerekli",
  });

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Mevcut şifre en az 8 karakter olmalı"),
  newPassword: z
    .string()
    .min(8, "Yeni şifre en az 8 karakter olmalı")
    .regex(/[A-Z]/, "Yeni şifre en az bir büyük harf içermeli")
    .regex(/[a-z]/, "Yeni şifre en az bir küçük harf içermeli")
    .regex(/[0-9]/, "Yeni şifre en az bir rakam içermeli"),
});

const wishlistParamSchema = z.object({
  productId: objectIdSchema,
});

const addressSchema = z.object({
  label: z.string().trim().min(1).max(50).optional(),
  city: z.string().trim().min(1, "İl zorunlu").max(80),
  district: z.string().trim().min(1, "İlçe zorunlu").max(80),
  postalCode: z.string().trim().min(1, "Posta kodu zorunlu").max(10),
  openAddress: z.string().trim().min(5, "Açık adres en az 5 karakter").max(500),
  country: z.string().trim().min(1).max(80).default("Türkiye"),
  isDefault: z.boolean().optional(),
  street: z.string().trim().max(120).optional(),
  zip: z.string().trim().max(20).optional(),
});

const createAddressSchema = addressSchema;

const updateAddressSchema = addressSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Güncellenecek en az bir alan gerekli",
});

const addressIdParamSchema = z.object({
  addressId: objectIdSchema,
});

module.exports = {
  updateProfileSchema,
  updatePasswordSchema,
  wishlistParamSchema,
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
};
