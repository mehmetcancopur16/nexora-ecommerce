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
  reportsQuerySchema,
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

/**
 * @openapi
 * /api/admin/categories:
 *   get:
 *     tags: [Admin]
 *     summary: Kategorileri sayfalı listeler
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get("/categories", validateQuery(adminPaginationQuerySchema), adminController.getAdminCategories);
/**
 * @openapi
 * /api/admin/categories:
 *   post:
 *     tags: [Admin]
 *     summary: Yeni kategori oluşturur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Kategori oluşturuldu
 *       400:
 *         description: Geçersiz veri
 */
router.post("/categories", validateBody(adminCategoryBodySchema), adminController.createAdminCategory);
/**
 * @openapi
 * /api/admin/categories/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Kategori günceller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kategori güncellendi
 *       404:
 *         description: Kategori bulunamadı
 */
router.patch(
  "/categories/:id",
  validateParams(adminEntityIdParamSchema),
  validateBody(adminCategoryUpdateBodySchema),
  adminController.updateAdminCategory
);
/**
 * @openapi
 * /api/admin/categories/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Kategori siler
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kategori silindi
 *       404:
 *         description: Kategori bulunamadı
 */
router.delete("/categories/:id", validateParams(adminEntityIdParamSchema), adminController.deleteAdminCategory);

/**
 * @openapi
 * /api/admin/coupons:
 *   get:
 *     tags: [Admin]
 *     summary: Kuponları sayfalı listeler
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get("/coupons", validateQuery(adminPaginationQuerySchema), adminController.getCoupons);
/**
 * @openapi
 * /api/admin/coupons:
 *   post:
 *     tags: [Admin]
 *     summary: Kupon oluşturur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Kupon oluşturuldu
 */
router.post("/coupons", validateBody(couponBodySchema), adminController.createCoupon);
/**
 * @openapi
 * /api/admin/coupons/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Kupon günceller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kupon güncellendi
 *       404:
 *         description: Kupon bulunamadı
 */
router.patch(
  "/coupons/:id",
  validateParams(adminEntityIdParamSchema),
  validateBody(couponUpdateBodySchema),
  adminController.updateCoupon
);
/**
 * @openapi
 * /api/admin/coupons/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Kupon siler
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kupon silindi
 *       404:
 *         description: Kupon bulunamadı
 */
router.delete("/coupons/:id", validateParams(adminEntityIdParamSchema), adminController.deleteCoupon);

/**
 * @openapi
 * /api/admin/reviews:
 *   get:
 *     tags: [Admin]
 *     summary: Yorumları moderasyon için listeler
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get("/reviews", validateQuery(adminPaginationQuerySchema), adminController.getAdminReviews);
/**
 * @openapi
 * /api/admin/reviews/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Yorumu moderasyon açısından günceller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Yorum güncellendi
 *       404:
 *         description: Yorum bulunamadı
 */
router.patch(
  "/reviews/:id",
  validateParams(adminEntityIdParamSchema),
  validateBody(reviewModerationBodySchema),
  adminController.updateAdminReview
);
/**
 * @openapi
 * /api/admin/reviews/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Yorumu siler
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Yorum silindi
 *       404:
 *         description: Yorum bulunamadı
 */
router.delete("/reviews/:id", validateParams(adminEntityIdParamSchema), adminController.deleteAdminReview);

/**
 * @openapi
 * /api/admin/reports:
 *   get:
 *     tags: [Admin]
 *     summary: Satış odaklı admin raporlarını getir
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: granularity
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: day
 *       - in: query
 *         name: topLimit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 8
 *       - in: query
 *         name: comparePrevious
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Başarılı
 *       400:
 *         description: Geçersiz query parametreleri
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Admin yetkisi gerekli
 */
router.get("/reports", validateQuery(reportsQuerySchema), adminController.getAdminReports);

/**
 * @openapi
 * /api/admin/settings:
 *   get:
 *     tags: [Admin]
 *     summary: Mağaza ayarlarını getirir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get("/settings", adminController.getStoreSettings);
/**
 * @openapi
 * /api/admin/settings:
 *   patch:
 *     tags: [Admin]
 *     summary: Mağaza ayarlarını günceller
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ayarlar güncellendi
 *       400:
 *         description: Geçersiz veri
 */
router.patch("/settings", validateBody(storeSettingsBodySchema), adminController.updateStoreSettings);

/**
 * @openapi
 * /api/admin/support-messages:
 *   get:
 *     tags: [Admin]
 *     summary: Destek mesajlarını listeler
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get("/support-messages", validateQuery(adminPaginationQuerySchema), adminController.getSupportMessages);
/**
 * @openapi
 * /api/admin/support-messages/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Destek mesajı admin durumunu günceller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Durum güncellendi
 *       404:
 *         description: Mesaj bulunamadı
 */
router.patch(
  "/support-messages/:id",
  validateParams(adminEntityIdParamSchema),
  validateBody(supportStatusBodySchema),
  adminController.updateSupportMessageStatus
);

module.exports = router;
