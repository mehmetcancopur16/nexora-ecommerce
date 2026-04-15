import { z } from "zod"

const emailField = z
  .string({ required_error: "E-posta adresi zorunludur." })
  .trim()
  .min(1, "E-posta adresi zorunludur.")
  .email("Lutfen gecerli bir e-posta adresi giriniz.")

const passwordField = z
  .string({ required_error: "Sifre zorunludur." })
  .min(8, "Sifre en az 8 karakter olmalidir.")

const nameField = z
  .string({ required_error: "Ad soyad zorunludur." })
  .trim()
  .optional()

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
})

export const registerSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
})
