const { z } = require("zod");

const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, "İsim en az 2 karakter olmalı").max(80).optional(),
    address: z
      .object({
        street: z.string().trim().min(1).max(120).optional(),
        city: z.string().trim().min(1).max(80).optional(),
        zip: z.string().trim().min(1).max(20).optional(),
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

module.exports = {
  updateProfileSchema,
  updatePasswordSchema,
};
