const express = require("express");
const adminController = require("../controllers/admin.controller");

const router = express.Router();

/**
 * @openapi
 * /api/settings/public:
 *   get:
 *     tags: [Settings]
 *     summary: Public mağaza ayarlarını getirir
 *     security: []
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get("/public", adminController.getPublicStoreSettings);

module.exports = router;
