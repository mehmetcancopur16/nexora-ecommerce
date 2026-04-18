const express = require("express");
const rateLimit = require("express-rate-limit");
const newsletterController = require("../controllers/newsletter.controller");

const router = express.Router();

const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Cok fazla bulten kaydi denemesi. Lutfen daha sonra tekrar deneyin.",
  },
});

/**
 * @openapi
 * /api/newsletter/subscribe:
 *   post:
 *     tags: [Newsletter]
 *     summary: Bulten aboneligi
 *     description: E-posta adresini bulten listesine ekler. Tekrar kayit idempotent mesaj doner.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               source:
 *                 type: string
 *                 enum: [home, footer]
 *                 description: Formun geldigi yer
 *     responses:
 *       201:
 *         description: Yeni kayit
 *       200:
 *         description: Zaten kayitli
 *       400:
 *         description: Gecersiz e-posta
 */
router.post("/subscribe", newsletterLimiter, newsletterController.subscribe);

module.exports = router;
