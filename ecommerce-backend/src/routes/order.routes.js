const express = require("express");
const orderController = require("../controllers/order.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireRoles } = require("../middlewares/role.middleware");
const { validateBody, validateParams, validateQuery } = require("../middlewares/validate.middleware");
const {
  createOrderSchema,
  payMockOrderSchema,
  updateOrderStatusSchema,
  adminOrdersQuerySchema,
  orderIdParamSchema,
} = require("../validations/order.validation");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Sepeti siparişe dönüştür
 *     description: Transaction ile stok düşülür, fiyat snapshot alınır, sipariş oluşturulur ve sepet temizlenir.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderBody'
 *     responses:
 *       201:
 *         description: Sipariş oluşturuldu
 *       400:
 *         description: Sepet boş veya geçersiz veri
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
 *       409:
 *         description: Stok yetersiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", validateBody(createOrderSchema), orderController.createOrder);
/**
 * @openapi
 * /api/orders/draft:
 *   post:
 *     tags: [Orders]
 *     summary: Ödeme öncesi taslak sipariş oluşturur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderBody'
 *     responses:
 *       201:
 *         description: Taslak sipariş oluşturuldu
 *       400:
 *         description: Geçersiz veri
 *       401:
 *         description: Yetkisiz
 */
router.post("/draft", validateBody(createOrderSchema), orderController.createDraftOrder);
/**
 * @openapi
 * /api/orders/{id}/pay-mock:
 *   post:
 *     tags: [Orders]
 *     summary: Taslak siparişi mock ödeme ile tamamlar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PayMockOrderBody'
 *     responses:
 *       200:
 *         description: Ödeme başarılı ve sipariş tamamlandı
 *       400:
 *         description: Geçersiz veri
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Sipariş bulunamadı
 */
router.post(
  "/:id/pay-mock",
  validateParams(orderIdParamSchema),
  validateBody(payMockOrderSchema),
  orderController.payMockOrder
);

/**
 * @openapi
 * /api/orders/my:
 *   get:
 *     tags: [Orders]
 *     summary: Kullanıcının siparişlerini getir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 *       401:
 *         description: Yetkisiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/my", orderController.getMyOrders);
/**
 * @openapi
 * /api/orders/my/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Kullanıcının tekil sipariş detayını getirir
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
 *         description: Başarılı
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Sipariş bulunamadı
 */
router.get("/my/:id", validateParams(orderIdParamSchema), orderController.getMyOrderById);
/**
 * @openapi
 * /api/orders/my/{id}/cancel:
 *   post:
 *     tags: [Orders]
 *     summary: Kullanıcı kendi siparişini iptal eder
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
 *         description: Sipariş iptal edildi
 *       400:
 *         description: Sipariş iptal edilemez durumda
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Sipariş bulunamadı
 */
router.post("/my/:id/cancel", validateParams(orderIdParamSchema), orderController.cancelMyOrder);

/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Tüm siparişleri getir (Admin)
 *     security:
 *       - bearerAuth: []
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
 *         description: Yasak
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", requireRoles("admin"), validateQuery(adminOrdersQuerySchema), orderController.getAllOrders);

/**
 * @openapi
 * /api/orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Sipariş durumunu güncelle (Admin)
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
 *             $ref: '#/components/schemas/OrderStatusUpdate'
 *     responses:
 *       200:
 *         description: Sipariş güncellendi
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
 *         description: Yasak
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Sipariş bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/:id/status",
  requireRoles("admin"),
  validateParams(orderIdParamSchema),
  validateBody(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

module.exports = router;
