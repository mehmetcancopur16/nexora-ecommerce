import { z } from "zod"

export const supportContactSchema = z.object({
  name: z.string().trim().min(1, "Ad gerekli").max(120),
  email: z.string().trim().email("Geçerli bir e-posta girin").max(320),
  category: z.enum(["siparis", "urun", "teknik", "diger"]),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmalıdır").max(5000),
})
