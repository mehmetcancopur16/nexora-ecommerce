const express = require("express");
const paymentMethodController = require("../controllers/paymentMethod.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validateBody, validateParams } = require("../middlewares/validate.middleware");
const {
  createPaymentMethodSchema,
  paymentMethodIdParamSchema,
} = require("../validations/paymentMethod.validation");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/payment-methods:
 *   get:
 *     tags: [PaymentMethods]
 *     summary: Kullanıcının ödeme yöntemlerini listeler
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 *       401:
 *         description: Yetkisiz
 */
router.get("/", paymentMethodController.getMyPaymentMethods);
/**
 * @openapi
 * /api/payment-methods:
 *   post:
 *     tags: [PaymentMethods]
 *     summary: Yeni ödeme yöntemi ekler
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentMethodCreate'
 *     responses:
 *       201:
 *         description: Ödeme yöntemi eklendi
 *       400:
 *         description: Geçersiz veri
 *       401:
 *         description: Yetkisiz
 */
router.post("/", validateBody(createPaymentMethodSchema), paymentMethodController.createPaymentMethod);
/**
 * @openapi
 * /api/payment-methods/{id}:
 *   delete:
 *     tags: [PaymentMethods]
 *     summary: Ödeme yöntemi siler
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
 *         description: Ödeme yöntemi silindi
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Kayıt bulunamadı
 */
router.delete(
  "/:id",
  validateParams(paymentMethodIdParamSchema),
  paymentMethodController.deletePaymentMethod
);
/**
 * @openapi
 * /api/payment-methods/{id}/default:
 *   patch:
 *     tags: [PaymentMethods]
 *     summary: Varsayılan ödeme yöntemini günceller
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
 *         description: Varsayılan ödeme yöntemi güncellendi
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Kayıt bulunamadı
 */
router.patch(
  "/:id/default",
  validateParams(paymentMethodIdParamSchema),
  paymentMethodController.setDefaultPaymentMethod
);

module.exports = router;
