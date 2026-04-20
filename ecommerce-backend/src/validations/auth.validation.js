const { z } = require("zod");

const loginBodySchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta girin").max(320),
  password: z.string().min(1, "Şifre gerekli").max(128),
});

const registerBodySchema = z.object({
  firstName: z.string().trim().min(2, "Ad en az 2 karakter olmalıdır").max(60),
  lastName: z.string().trim().min(2, "Soyad en az 2 karakter olmalıdır").max(60),
  email: z.string().trim().email("Geçerli bir e-posta girin").max(320),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{10,20}$/, "Geçerli bir telefon numarası girin"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır").max(128),
  confirmPassword: z.string().min(8, "Şifre tekrarı en az 8 karakter olmalıdır").max(128),
  privacyConsent: z.literal(true, {
    errorMap: () => ({
      message: "Kayıt için gizlilik ve kullanım koşulları kabul edilmelidir",
    }),
  }),
}).refine((values) => values.password === values.confirmPassword, {
  path: ["confirmPassword"],
  message: "Şifreler eşleşmiyor",
});

module.exports = {
  loginBodySchema,
  registerBodySchema,
};
