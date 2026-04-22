const { z } = require("zod");

const objectIdSchema = z
  .string()
  .length(24, "Geçersiz ObjectId")
  .regex(/^[a-fA-F0-9]{24}$/, "Geçersiz ObjectId");

const notificationIdParamSchema = z.object({
  id: objectIdSchema,
});

const notificationPreferencesSchema = z.object({
  orderUpdates: z.boolean().optional(),
  promotions: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
  productNews: z.boolean().optional(),
});

module.exports = {
  notificationIdParamSchema,
  notificationPreferencesSchema,
};
