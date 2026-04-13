const express = require("express");
const orderController = require("../controllers/order.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireRoles } = require("../middlewares/role.middleware");
const { validateBody, validateParams } = require("../middlewares/validate.middleware");
const {
  createOrderSchema,
  updateOrderStatusSchema,
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
 *       401:
 *         description: Yetkisiz
 *       409:
 *         description: Stok yetersiz
 */
router.post("/", validateBody(createOrderSchema), orderController.createOrder);

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
 */
router.get("/my", orderController.getMyOrders);

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
 *       403:
 *         description: Yasak
 */
router.get("/", requireRoles("admin"), orderController.getAllOrders);

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
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Yasak
 *       404:
 *         description: Sipariş bulunamadı
 */
router.patch(
  "/:id/status",
  requireRoles("admin"),
  validateParams(orderIdParamSchema),
  validateBody(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

module.exports = router;
