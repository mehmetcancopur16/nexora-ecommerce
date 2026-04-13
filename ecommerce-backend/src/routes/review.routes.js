const express = require("express");
const reviewController = require("../controllers/review.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validateBody, validateParams } = require("../middlewares/validate.middleware");
const {
  createReviewSchema,
  reviewIdParamSchema,
  productIdParamSchema,
} = require("../validations/review.validation");

const router = express.Router();

/**
 * @openapi
 * /api/reviews/product/{productId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Ürüne ait yorumları getir
 *     security: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *     responses:
 *       200:
 *         description: Başarılı
 *       400:
 *         description: Geçersiz ürün kimliği
 */
router.get(
  "/product/:productId",
  validateParams(productIdParamSchema),
  reviewController.getProductReviews
);

/**
 * @openapi
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Ürüne yorum ekle
 *     description: Kullanıcı ürünü daha önce satın almış olmalıdır.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewCreate'
 *     responses:
 *       201:
 *         description: Yorum oluşturuldu
 *       400:
 *         description: Geçersiz veri
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Satın alma koşulu veya yetki hatası
 *       409:
 *         description: Aynı ürün için tekrar yorum
 */
router.post(
  "/",
  authMiddleware,
  validateBody(createReviewSchema),
  reviewController.createReview
);

/**
 * @openapi
 * /api/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Yorumu sil (sahibi veya admin)
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
 *         description: Yorum silindi
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Yorum silme yetkisi yok
 *       404:
 *         description: Yorum bulunamadı
 */
router.delete(
  "/:id",
  authMiddleware,
  validateParams(reviewIdParamSchema),
  reviewController.deleteReview
);

module.exports = router;
