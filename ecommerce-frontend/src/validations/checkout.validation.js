import { z } from "zod"

export const checkoutSchema = z.object({
  street: z
    .string({ required_error: "Adres bilgisi zorunludur." })
    .trim()
    .min(5, "Adres en az 5 karakter olmalidir."),
  city: z
    .string({ required_error: "Sehir bilgisi zorunludur." })
    .trim()
    .min(2, "Sehir bilgisi en az 2 karakter olmalidir."),
  zip: z
    .string({ required_error: "Posta kodu zorunludur." })
    .trim()
    .min(3, "Posta kodu en az 3 karakter olmalidir."),
})
