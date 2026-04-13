const express = require("express");
const cartController = require("../controllers/cart.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validateBody, validateParams } = require("../middlewares/validate.middleware");
const {
  addToCartSchema,
  updateCartItemSchema,
  cartItemParamSchema,
} = require("../validations/cart.validation");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Kullanıcının sepetini getir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 *       401:
 *         description: Yetkisiz
 */
router.get("/", cartController.getCart);

/**
 * @openapi
 * /api/cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Sepete ürün ekle
 *     description: Ürün zaten sepetteyse miktar arttırılır.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId:
 *                 type: string
 *                 pattern: '^[a-fA-F0-9]{24}$'
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Sepet güncellendi
 *       400:
 *         description: Geçersiz veri
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Ürün bulunamadı
 *       409:
 *         description: Stok yetersiz
 */
router.post("/items", validateBody(addToCartSchema), cartController.addToCart);

/**
 * @openapi
 * /api/cart/items/{productId}:
 *   patch:
 *     tags: [Cart]
 *     summary: Sepette ürün adedini güncelle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Sepet güncellendi
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Sepet/ürün bulunamadı
 *       409:
 *         description: Stok yetersiz
 */
router.patch(
  "/items/:productId",
  validateParams(cartItemParamSchema),
  validateBody(updateCartItemSchema),
  cartController.updateCartItem
);

/**
 * @openapi
 * /api/cart/items/{productId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Sepetten ürün kaldır
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *     responses:
 *       200:
 *         description: Ürün sepetten kaldırıldı
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Sepet/ürün bulunamadı
 */
router.delete(
  "/items/:productId",
  validateParams(cartItemParamSchema),
  cartController.removeFromCart
);

module.exports = router;
