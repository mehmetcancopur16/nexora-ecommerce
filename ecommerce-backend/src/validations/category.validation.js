const { z } = require("zod");

const createCategorySchema = z.object({
  name: z.string().min(1, "İsim gerekli").trim(),
  description: z.string().optional(),
});

module.exports = { createCategorySchema };
