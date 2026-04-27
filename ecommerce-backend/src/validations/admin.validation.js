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

const adminPaginationQuerySchema = z.object({
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
  status: z.string().optional(),
});

const adminCategoryBodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().max(300).optional().default(""),
});

const adminCategoryUpdateBodySchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().max(300).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Güncelleme için en az bir alan gerekli",
  });

const adminEntityIdParamSchema = z.object({
  id: objectIdSchema,
});

const couponBodySchema = z.object({
  code: z.string().trim().min(3).max(30),
  description: z.string().max(300).optional().default(""),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(0),
  minOrderAmount: z.number().min(0).optional().default(0),
  maxDiscountAmount: z.number().min(0).nullable().optional().default(null),
  usageLimit: z.number().int().min(1).optional().default(100),
  startsAt: z.string().datetime().nullable().optional().default(null),
  expiresAt: z.string().datetime().nullable().optional().default(null),
  isActive: z.boolean().optional().default(true),
});

const couponUpdateBodySchema = z
  .object({
    code: z.string().trim().min(3).max(30).optional(),
    description: z.string().max(300).optional(),
    discountType: z.enum(["percentage", "fixed"]).optional(),
    discountValue: z.number().min(0).optional(),
    minOrderAmount: z.number().min(0).optional(),
    maxDiscountAmount: z.number().min(0).nullable().optional(),
    usageLimit: z.number().int().min(1).optional(),
    startsAt: z.string().datetime().nullable().optional(),
    expiresAt: z.string().datetime().nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Güncelleme için en az bir alan gerekli",
  });

const reviewModerationBodySchema = z
  .object({
    moderationStatus: z.enum(["approved", "rejected"]).optional(),
    isHidden: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Güncelleme için en az bir alan gerekli",
  });

const reportsQuerySchema = z
  .object({
    startDate: z
      .string()
      .datetime()
      .optional(),
    endDate: z
      .string()
      .datetime()
      .optional(),
    granularity: z.enum(["day", "week", "month"]).optional().default("day"),
    topLimit: z.preprocess((val) => {
      if (val === undefined || val === "") return 8;
      const n = Number(val);
      return Number.isFinite(n) ? n : 8;
    }, z.number().int().min(1).max(50)),
    tz: z.string().trim().min(1).max(64).optional().default("Europe/Istanbul"),
    comparePrevious: z.preprocess((val) => {
      if (val === undefined || val === "") return false;
      if (typeof val === "boolean") return val;
      if (typeof val === "string") return val.toLowerCase() === "true";
      return false;
    }, z.boolean()),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.startDate).getTime() <= new Date(data.endDate).getTime();
    },
    {
      message: "startDate endDate'den büyük olamaz",
      path: ["startDate"],
    }
  );

const supportStatusBodySchema = z.object({
  adminStatus: z.enum(["open", "in_progress", "resolved"]),
});

const storeSettingsBodySchema = z
  .object({
    storeName: z.string().trim().min(2).max(120).optional(),
    supportEmail: z.string().email().optional(),
    supportPhone: z.string().max(40).optional(),
    currency: z.string().trim().min(3).max(3).optional(),
    maintenanceMode: z.boolean().optional(),
    allowGuestCheckout: z.boolean().optional(),
    lowStockThreshold: z.number().int().min(0).max(500).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Güncelleme için en az bir alan gerekli",
  });

module.exports = {
  adminUsersQuerySchema,
  adminUserIdParamSchema,
  updateUserRoleStatusSchema,
  adminPaginationQuerySchema,
  adminCategoryBodySchema,
  adminCategoryUpdateBodySchema,
  adminEntityIdParamSchema,
  couponBodySchema,
  couponUpdateBodySchema,
  reviewModerationBodySchema,
  reportsQuerySchema,
  supportStatusBodySchema,
  storeSettingsBodySchema,
};
