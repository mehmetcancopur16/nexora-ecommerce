const mongoose = require("mongoose");
const logger = require("../utils/logger");

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

async function connectWithRetry(attempt = 1) {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    logger.error("MONGO_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    logger.info("MongoDB bağlantısı kuruldu");

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB bağlantısı kesildi");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB yeniden bağlandı");
    });
  } catch (err) {
    logger.error("MongoDB bağlantı denemesi başarısız", {
      attempt,
      maxRetries: MAX_RETRIES,
      message: err.message,
    });

    if (attempt >= MAX_RETRIES) {
      logger.error("MongoDB maksimum yeniden deneme sayısına ulaşıldı");
      process.exit(1);
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    return connectWithRetry(attempt + 1);
  }
}

module.exports = { connectDB: connectWithRetry };
