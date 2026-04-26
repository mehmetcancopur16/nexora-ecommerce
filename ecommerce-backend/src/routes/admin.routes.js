const express = require("express");
const adminController = require("../controllers/admin.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireRoles } = require("../middlewares/role.middleware");
const { validateQuery, validateBody, validateParams } = require("../middlewares/validate.middleware");
const {
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
  supportStatusBodySchema,
  storeSettingsBodySchema,
} = require("../validations/admin.validation");

const router = express.Router();

router.use(authMiddleware, requireRoles("admin"));

/**
 * @openapi
 * /api/admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Admin dashboard istatistiklerini getir
 *     description: Toplam kullanıcı, sipariş, gelir, sipariş durum dağılımı ve düşük stok ürünleri döndürür.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AdminDashboardStats'
 *       401:
 *         description: Yetkisiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin yetkisi gerekli
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/dashboard", adminController.getDashboardStats);

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Kullanıcıları sayfalı listele
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: email veya name üzerinde arama metni
 *     responses:
 *       200:
 *         description: Başarılı
 *       401:
 *         description: Yetkisiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin yetkisi gerekli
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/users", validateQuery(adminUsersQuerySchema), adminController.getAllUsers);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Kullanıcı rol/durum güncelle (admin veya ban)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUserUpdate'
 *     responses:
 *       200:
 *         description: Kullanıcı güncellendi
 *       400:
 *         description: Geçersiz veri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Yetkisiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin yetkisi gerekli
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/users/:id",
  validateParams(adminUserIdParamSchema),
  validateBody(updateUserRoleStatusSchema),
  adminController.updateUserRoleStatus
);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Kullanıcıyı sil
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *     responses:
 *       200:
 *         description: Kullanıcı silindi
 *       401:
 *         description: Yetkisiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin yetkisi gerekli
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/users/:id", validateParams(adminUserIdParamSchema), adminController.deleteUser);

router.get("/categories", validateQuery(adminPaginationQuerySchema), adminController.getAdminCategories);
router.post("/categories", validateBody(adminCategoryBodySchema), adminController.createAdminCategory);
router.patch(
  "/categories/:id",
  validateParams(adminEntityIdParamSchema),
  validateBody(adminCategoryUpdateBodySchema),
  adminController.updateAdminCategory
);
router.delete("/categories/:id", validateParams(adminEntityIdParamSchema), adminController.deleteAdminCategory);

router.get("/coupons", validateQuery(adminPaginationQuerySchema), adminController.getCoupons);
router.post("/coupons", validateBody(couponBodySchema), adminController.createCoupon);
router.patch(
  "/coupons/:id",
  validateParams(adminEntityIdParamSchema),
  validateBody(couponUpdateBodySchema),
  adminController.updateCoupon
);
router.delete("/coupons/:id", validateParams(adminEntityIdParamSchema), adminController.deleteCoupon);

router.get("/reviews", validateQuery(adminPaginationQuerySchema), adminController.getAdminReviews);
router.patch(
  "/reviews/:id",
  validateParams(adminEntityIdParamSchema),
  validateBody(reviewModerationBodySchema),
  adminController.updateAdminReview
);
router.delete("/reviews/:id", validateParams(adminEntityIdParamSchema), adminController.deleteAdminReview);

router.get("/reports", adminController.getAdminReports);

router.get("/settings", adminController.getStoreSettings);
router.patch("/settings", validateBody(storeSettingsBodySchema), adminController.updateStoreSettings);

router.get("/support-messages", validateQuery(adminPaginationQuerySchema), adminController.getSupportMessages);
router.patch(
  "/support-messages/:id",
  validateParams(adminEntityIdParamSchema),
  validateBody(supportStatusBodySchema),
  adminController.updateSupportMessageStatus
);

module.exports = router;
