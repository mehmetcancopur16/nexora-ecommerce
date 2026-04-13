require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const { connectDB } = require("./config/db");
const { buildSwaggerSpec } = require("./config/swagger");
const logger = require("./utils/logger");
const { errorHandler, notFoundHandler } = require("./middlewares/error.middleware");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "nexora-ecommerce-api" });
});

const swaggerSpec = buildSwaggerSpec();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap() {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Sunucu ${PORT} portunda dinleniyor`);
  });
}

bootstrap().catch((err) => {
  logger.error("Uygulama başlatılamadı", { message: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = app;
