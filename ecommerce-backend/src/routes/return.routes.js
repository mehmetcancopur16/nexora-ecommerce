const express = require("express");
const returnController = require("../controllers/return.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireRoles } = require("../middlewares/role.middleware");
const { validateBody, validateParams } = require("../middlewares/validate.middleware");
const {
  createReturnSchema,
  updateReturnStatusSchema,
  returnIdParamSchema,
} = require("../validations/return.validation");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/returns/my:
 *   get:
 *     tags: [Returns]
 *     summary: Kullanıcının iade taleplerini listeler
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 *       401:
 *         description: Yetkisiz
 */
router.get("/my", returnController.getMyReturns);
/**
 * @openapi
 * /api/returns:
 *   post:
 *     tags: [Returns]
 *     summary: Yeni iade talebi oluşturur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReturnRequestCreate'
 *     responses:
 *       201:
 *         description: İade talebi oluşturuldu
 *       400:
 *         description: Geçersiz veri
 *       401:
 *         description: Yetkisiz
 */
router.post("/", validateBody(createReturnSchema), returnController.createReturnRequest);
/**
 * @openapi
 * /api/returns:
 *   get:
 *     tags: [Returns]
 *     summary: Tüm iade taleplerini listeler (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Admin yetkisi gerekli
 */
router.get("/", requireRoles("admin"), returnController.getAllReturns);
/**
 * @openapi
 * /api/returns/{id}/status:
 *   patch:
 *     tags: [Returns]
 *     summary: İade talebi durumunu günceller (Admin)
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
 *             $ref: '#/components/schemas/ReturnStatusUpdate'
 *     responses:
 *       200:
 *         description: Durum güncellendi
 *       400:
 *         description: Geçersiz veri
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Admin yetkisi gerekli
 *       404:
 *         description: İade kaydı bulunamadı
 */
router.patch(
  "/:id/status",
  requireRoles("admin"),
  validateParams(returnIdParamSchema),
  validateBody(updateReturnStatusSchema),
  returnController.updateReturnStatus
);

module.exports = router;
