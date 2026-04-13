const { z } = require("zod");

const objectIdSchema = z
  .string()
  .length(24, "Geçersiz ObjectId")
  .regex(/^[a-fA-F0-9]{24}$/, "Geçersiz ObjectId");

const adminUsersQuerySchema = z.object({
  page: z.preprocess((val) => {
    if (val === undefined || val === "") return 1;
    const n = Number(val);
    return Number.isFinite(n) ? n : 1;
  }, z.number().int().min(1)),
  limit: z.preprocess((val) => {
    if (val === undefined || val === "") return 10;
    const n = Number(val);
    return Number.isFinite(n) ? n : 10;
  }, z.number().int().min(1).max(100)),
  search: z.preprocess((val) => (typeof val === "string" ? val.trim() : val), z.string().optional()),
});

const adminUserIdParamSchema = z.object({
  id: objectIdSchema,
});

const updateUserRoleStatusSchema = z
  .object({
    role: z.enum(["user", "admin"]).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Güncelleme için en az bir alan gerekli",
  });

module.exports = {
  adminUsersQuerySchema,
  adminUserIdParamSchema,
  updateUserRoleStatusSchema,
};
