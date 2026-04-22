import { z } from "zod"

export const checkoutSchema = z.object({
  firstName: z.string({ required_error: "Ad zorunludur." }).trim().min(2, "Ad en az 2 karakter olmalidir."),
  lastName: z
    .string({ required_error: "Soyad zorunludur." })
    .trim()
    .min(2, "Soyad en az 2 karakter olmalidir."),
  email: z.string({ required_error: "E-posta zorunludur." }).trim().email("Gecerli bir e-posta giriniz."),
  phone: z.string({ required_error: "Telefon zorunludur." }).trim().min(10, "Telefon numarasi gecersiz."),
  city: z.string({ required_error: "Il zorunludur." }).trim().min(1, "Il zorunludur.").max(80),
  district: z.string({ required_error: "Ilce zorunludur." }).trim().min(1, "Ilce zorunludur.").max(80),
  postalCode: z
    .string({ required_error: "Posta kodu zorunludur." })
    .trim()
    .min(3, "Posta kodu en az 3 karakter olmalidir.")
    .max(10),
  openAddress: z
    .string({ required_error: "Acik adres zorunludur." })
    .trim()
    .min(5, "Acik adres en az 5 karakter olmalidir.")
    .max(500),
  country: z.string({ required_error: "Ulke zorunludur." }).trim().min(2, "Ulke bilgisi gecersiz."),
  paymentMethod: z.enum(["mock_card", "bank_transfer", "cash_on_delivery"]),
  cardHolderName: z.string().trim().optional(),
  cardNumber: z.string().trim().optional(),
  expiry: z.string().trim().optional(),
  cvc: z.string().trim().optional(),
})
  .superRefine((values, ctx) => {
    if (values.paymentMethod !== "mock_card") return;

    if (!values.cardHolderName || values.cardHolderName.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kart sahibi adi en az 3 karakter olmalidir.",
        path: ["cardHolderName"],
      });
    }
    if (!/^\d{16}$/.test(values.cardNumber || "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kart numarasi 16 haneli olmalidir.",
        path: ["cardNumber"],
      });
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiry || "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Son kullanma tarihi MM/YY formatinda olmalidir.",
        path: ["expiry"],
      });
    }
    if (!/^\d{3,4}$/.test(values.cvc || "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CVC 3 veya 4 haneli olmalidir.",
        path: ["cvc"],
      });
    }
  })
