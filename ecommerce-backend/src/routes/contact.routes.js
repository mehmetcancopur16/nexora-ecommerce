const express = require("express");
const rateLimit = require("express-rate-limit");
const contactController = require("../controllers/contact.controller");
const { validateBody } = require("../middlewares/validate.middleware");
const { contactMessageBodySchema } = require("../validations/contact.validation");

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Cok fazla iletisim formu gonderimi. Lutfen daha sonra tekrar deneyin.",
  },
});

/**
 * @openapi
 * /api/contact:
 *   post:
 *     tags: [Contact]
 *     summary: Destek iletisim formu
 *     description: Mesaji MongoDB'ye kaydeder. Kimlik dogrulama gerekmez; rate limit uygulanir.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 120
 *               email:
 *                 type: string
 *                 format: email
 *               category:
 *                 type: string
 *                 enum: [siparis, urun, teknik, diger]
 *               subject:
 *                 type: string
 *                 maxLength: 200
 *               message:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 5000
 *     responses:
 *       201:
 *         description: Mesaj kaydedildi
 *       400:
 *         description: Gecersiz veri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  contactLimiter,
  validateBody(contactMessageBodySchema),
  contactController.createContactMessage
);

module.exports = router;
