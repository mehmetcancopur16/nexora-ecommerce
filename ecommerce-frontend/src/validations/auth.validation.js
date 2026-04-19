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

const nameField = z
  .string({ required_error: "Ad soyad zorunludur." })
  .trim()
  .min(2, "Ad soyad en az 2 karakter olmalıdır.")
  .max(120)

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
})

export const registerSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
})
