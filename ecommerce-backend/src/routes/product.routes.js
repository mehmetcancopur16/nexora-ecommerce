const express = require("express");
const productController = require("../controllers/product.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireRoles } = require("../middlewares/role.middleware");
const { upload } = require("../middlewares/upload.middleware");
const { validateBody, validateQuery } = require("../middlewares/validate.middleware");
const {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
} = require("../validations/product.validation");

const router = express.Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Ürünleri sayfalı listele
 *     description: |
 *       Yalnızca `isActive: true` ürünleri döndürür. `page` ve `limit` ile sayfalama;
 *       `category` ile ObjectId üzerinden filtreleme; `search` ile `name` alanında MongoDB full-text araması yapılır.
 *       Kategori bilgisi `populate` ile eklenir.
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Sayfa başına kayıt (maks. 100)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: Kategori ObjectId filtresi
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Ürün adında full-text arama metni
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
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Geçersiz sorgu parametreleri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/",
  validateQuery(listProductsQuerySchema),
  productController.getAllProducts
);

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Yeni ürün oluştur
 *     description: Yalnızca `admin` rolü ve geçerli Bearer JWT.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, stock, category]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Pozitif fiyat
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               category:
 *                 type: string
 *                 description: Kategori ObjectId (24 hex)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Oluşturuldu
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
 *       400:
 *         description: Doğrulama veya geçersiz kategori
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  authMiddleware,
  requireRoles("admin"),
  validateBody(createProductSchema),
  productController.createProduct
);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Tek ürün getir
 *     description: Yalnızca aktif ürünler döner; kategori populate edilir.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: Ürün ObjectId
 *     responses:
 *       200:
 *         description: Başarılı
 *       404:
 *         description: Bulunamadı veya pasif ürün
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", productController.getProductById);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Ürünü güncelle
 *     description: En az bir alan gönderilmeli. Yalnızca `admin` ve Bearer JWT.
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
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Güncellendi
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
 *         description: Ürün bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/:id",
  authMiddleware,
  requireRoles("admin"),
  validateBody(updateProductSchema),
  productController.updateProduct
);

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Ürünü soft-delete yap
 *     description: Kaydı silmez; `isActive` alanını false yapar. Yalnızca `admin` ve Bearer JWT.
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
 *         description: Pasifleştirildi
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
 *         description: Ürün bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  "/:id",
  authMiddleware,
  requireRoles("admin"),
  productController.deleteProduct
);

/**
 * @openapi
 * /api/products/{id}/upload:
 *   post:
 *     tags: [Products]
 *     summary: Ürüne görsel yükle (Admin)
 *     description: |
 *       Yalnızca admin erişimi vardır. `multipart/form-data` ile `images` alanında en fazla 5 dosya kabul edilir.
 *       Sadece `image/jpeg`, `image/png`, `image/webp` desteklenir; dosya başına limit 5MB'dır.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: Ürün ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [images]
 *             properties:
 *               images:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Görseller başarıyla yüklendi
 *       400:
 *         description: Geçersiz id, dosya türü veya dosya boyutu
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
 *         description: Ürün bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/:id/upload",
  authMiddleware,
  requireRoles("admin"),
  upload.array("images", 5),
  productController.uploadProductImages
);

module.exports = router;
