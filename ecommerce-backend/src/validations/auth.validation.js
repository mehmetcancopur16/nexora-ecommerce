const { z } = require("zod");

const loginBodySchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta girin").max(320),
  password: z.string().min(1, "Şifre gerekli").max(128),
});

const registerBodySchema = z.object({
  name: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalıdır").max(120),
  email: z.string().trim().email("Geçerli bir e-posta girin").max(320),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır").max(128),
});

module.exports = {
  loginBodySchema,
  registerBodySchema,
};
