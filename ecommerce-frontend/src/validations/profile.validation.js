import { z } from "zod"

/** Saved address (profile + addresses page) */
export const addressFormSchema = z.object({
  label: z.string().trim().max(50).optional(),
  city: z.string().trim().min(1, "Il seciniz.").max(80),
  district: z.string().trim().min(1, "Ilce seciniz.").max(80),
  postalCode: z.string().trim().min(3, "Posta kodu gecersiz.").max(10),
  openAddress: z.string().trim().min(5, "Acik adres en az 5 karakter.").max(500),
  country: z.string().trim().min(1).max(80).default("Türkiye"),
  isDefault: z.boolean().optional(),
})

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
  city: z
    .string({ required_error: "Il zorunludur." })
    .trim()
    .min(1, "Il zorunludur.")
    .max(80, "Il en fazla 80 karakter olabilir."),
  district: z
    .string({ required_error: "Ilce zorunludur." })
    .trim()
    .min(1, "Ilce zorunludur.")
    .max(80, "Ilce en fazla 80 karakter olabilir."),
  postalCode: z
    .string({ required_error: "Posta kodu zorunludur." })
    .trim()
    .min(3, "Posta kodu en az 3 karakter olmalidir.")
    .max(10, "Posta kodu en fazla 10 karakter olabilir."),
  openAddress: z
    .string({ required_error: "Acik adres zorunludur." })
    .trim()
    .min(5, "Acik adres en az 5 karakter olmalidir.")
    .max(500, "Acik adres cok uzun."),
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
