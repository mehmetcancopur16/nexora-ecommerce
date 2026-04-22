import { z } from "zod"
import { composeInternationalPhone, digitsOnly } from "../utils/phone"

/** Aligned with backend register/login phone pattern */
const composedPhoneRegex = /^\+?[0-9\s()-]{10,20}$/

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

export const loginSchema = z
  .object({
    loginType: z.enum(["email", "phone"]),
    email: z.string().optional(),
    phoneDial: z.string().optional(),
    phoneLocal: z.string().optional(),
    password: passwordField,
    rememberMe: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.loginType === "email") {
      const parsed = emailField.safeParse(data.email ?? "")
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) =>
          ctx.addIssue({ ...issue, path: ["email"] })
        )
      }
      return
    }
    const dial = (data.phoneDial ?? "").trim()
    const localRaw = (data.phoneLocal ?? "").trim()
    if (!dial) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ülke kodu seçin.",
        path: ["phoneDial"],
      })
    }
    if (!localRaw) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Telefon numarası zorunludur.",
        path: ["phoneLocal"],
      })
      return
    }
    const localDigits = digitsOnly(localRaw)
    if (localDigits.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Telefon numarası en az 8 rakam içermelidir.",
        path: ["phoneLocal"],
      })
    }
    const composed = composeInternationalPhone(dial, localRaw)
    if (!composedPhoneRegex.test(composed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Geçerli bir telefon numarası giriniz.",
        path: ["phoneLocal"],
      })
    }
  })

export const registerSchema = z
  .object({
    firstName: firstNameField,
    lastName: lastNameField,
    email: emailField,
    phoneDial: z.string().trim().min(1, "Ülke kodu seçin."),
    phoneLocal: z
      .string({ required_error: "Telefon numarası zorunludur." })
      .trim()
      .min(1, "Telefon numarası zorunludur."),
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
  .superRefine((data, ctx) => {
    const localDigits = digitsOnly(data.phoneLocal)
    if (localDigits.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Telefon numarası en az 8 rakam içermelidir.",
        path: ["phoneLocal"],
      })
    }
    const composed = composeInternationalPhone(data.phoneDial, data.phoneLocal)
    if (!composedPhoneRegex.test(composed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Geçerli bir telefon numarası giriniz.",
        path: ["phoneLocal"],
      })
    }
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Şifreler birbiriyle eşleşmiyor.",
  })
