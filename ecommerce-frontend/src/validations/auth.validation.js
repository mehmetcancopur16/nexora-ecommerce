import { z } from "zod"

const emailField = z
  .string({ required_error: "E-posta adresi zorunludur." })
  .trim()
  .min(1, "E-posta adresi zorunludur.")
  .email("Lütfen geçerli bir e-posta adresi giriniz.")
  .max(320)

const passwordField = z
  .string({ required_error: "Şifre zorunludur." })
  .min(8, "Şifre en az 8 karakter olmalıdır.")
  .max(128)

const firstNameField = z
  .string({ required_error: "Ad zorunludur." })
  .trim()
  .min(2, "Ad en az 2 karakter olmalıdır.")
  .max(60)

const lastNameField = z
  .string({ required_error: "Soyad zorunludur." })
  .trim()
  .min(2, "Soyad en az 2 karakter olmalıdır.")
  .max(60)

const phoneField = z
  .string({ required_error: "Telefon numarası zorunludur." })
  .trim()
  .regex(/^\+?[0-9\s()-]{10,20}$/, "Geçerli bir telefon numarası giriniz.")

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
})

export const registerSchema = z
  .object({
    firstName: firstNameField,
    lastName: lastNameField,
    email: emailField,
    phone: phoneField,
    password: passwordField,
    confirmPassword: z
      .string({ required_error: "Şifre tekrarı zorunludur." })
      .min(8, "Şifre tekrarı en az 8 karakter olmalıdır.")
      .max(128),
    privacyConsent: z.literal(true, {
      errorMap: () => ({
        message: "Devam etmek için gizlilik ve kullanım koşullarını kabul etmelisiniz.",
      }),
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Şifreler birbiriyle eşleşmiyor.",
  })
