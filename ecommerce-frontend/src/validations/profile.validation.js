import { z } from "zod"

export const profileUpdateSchema = z.object({
  firstName: z
    .string({ required_error: "Ad zorunludur." })
    .trim()
    .min(2, "Ad en az 2 karakter olmalidir.")
    .max(60, "Ad en fazla 60 karakter olabilir."),
  lastName: z
    .string({ required_error: "Soyad zorunludur." })
    .trim()
    .min(2, "Soyad en az 2 karakter olmalidir.")
    .max(60, "Soyad en fazla 60 karakter olabilir."),
  phone: z
    .string({ required_error: "Telefon numarasi zorunludur." })
    .trim()
    .regex(/^\+?[0-9\s()-]{10,20}$/, "Gecerli bir telefon numarasi giriniz."),
  street: z
    .string({ required_error: "Sokak bilgisi zorunludur." })
    .trim()
    .min(1, "Sokak bilgisi zorunludur.")
    .max(120, "Sokak bilgisi en fazla 120 karakter olabilir."),
  city: z
    .string({ required_error: "Sehir bilgisi zorunludur." })
    .trim()
    .min(1, "Sehir bilgisi zorunludur.")
    .max(80, "Sehir bilgisi en fazla 80 karakter olabilir."),
  zip: z
    .string({ required_error: "Posta kodu zorunludur." })
    .trim()
    .min(1, "Posta kodu zorunludur.")
    .max(20, "Posta kodu en fazla 20 karakter olabilir."),
})

export const passwordUpdateSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Mevcut sifre zorunludur." })
      .min(8, "Mevcut sifre en az 8 karakter olmalidir."),
    newPassword: z
      .string({ required_error: "Yeni sifre zorunludur." })
      .min(8, "Yeni sifre en az 8 karakter olmalidir.")
      .regex(/[A-Z]/, "Yeni sifre en az bir buyuk harf icermelidir.")
      .regex(/[a-z]/, "Yeni sifre en az bir kucuk harf icermelidir.")
      .regex(/[0-9]/, "Yeni sifre en az bir rakam icermelidir."),
    confirmPassword: z
      .string({ required_error: "Yeni sifre tekrari zorunludur." })
      .min(8, "Yeni sifre tekrari en az 8 karakter olmalidir."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Yeni sifreler birbiriyle eslesmiyor.",
  })
