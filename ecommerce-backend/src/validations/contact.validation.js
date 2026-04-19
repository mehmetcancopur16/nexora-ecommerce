const { z } = require("zod");

const contactMessageBodySchema = z.object({
  name: z.string().trim().min(1, "Ad gerekli").max(120),
  email: z.string().trim().email("Gecerli bir e-posta girin").max(320),
  category: z.enum(["siparis", "urun", "teknik", "diger"]).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmali").max(5000),
});

module.exports = {
  contactMessageBodySchema,
};
