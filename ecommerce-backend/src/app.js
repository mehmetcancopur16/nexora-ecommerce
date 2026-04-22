require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const { connectDB } = require("./config/db");
const { buildSwaggerSpec } = require("./config/swagger");
const logger = require("./utils/logger");
const { errorHandler, notFoundHandler } = require("./middlewares/error.middleware");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const userRoutes = require("./routes/user.routes");
const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");
const newsletterRoutes = require("./routes/newsletter.routes");
const contactRoutes = require("./routes/contact.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 5000;
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.",
  },
});

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use((req, _res, next) => {
  ["body", "params", "headers", "query"].forEach((key) => {
    if (req[key]) {
      mongoSanitize.sanitize(req[key]);
    }
  });
  next();
});
app.use(hpp());
app.use(express.json());
app.use("/api", globalLimiter);
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [System]
 *     summary: API saglik kontrolu
 *     responses:
 *       200:
 *         description: Servis ayakta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 service:
 *                   type: string
 *                   example: nexora-ecommerce-api
 */
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "nexora-ecommerce-api" });
});

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Kisa saglik kontrolu
 *     responses:
 *       200:
 *         description: Servis ayakta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 service:
 *                   type: string
 *                   example: nexora-ecommerce-api
 */
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "nexora-ecommerce-api" });
});

const swaggerSpec = buildSwaggerSpec();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap() {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Sunucu ${PORT} portunda dinleniyor`);
    logger.info(`Swagger UI: http://localhost:${PORT}/api-docs`);
    logger.info(`OpenAPI JSON: http://localhost:${PORT}/api-docs.json`);
  });
}

bootstrap().catch((err) => {
  logger.error("Uygulama başlatılamadı", { message: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = app;
