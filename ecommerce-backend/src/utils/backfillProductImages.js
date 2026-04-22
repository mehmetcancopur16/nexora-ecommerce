require("dotenv").config();

const { connectDB } = require("../config/db");
const Product = require("../models/Product.model");
const logger = require("./logger");

const DEFAULT_PRODUCT_IMAGE = "/uploads/products/demo-product.svg";

async function runBackfill() {
  try {
    await connectDB();

    const result = await Product.updateMany(
      {
        $or: [
          { images: { $exists: false } },
          { images: { $size: 0 } },
          { images: null },
        ],
      },
      {
        $set: { images: [DEFAULT_PRODUCT_IMAGE] },
      }
    );

    logger.info("Urun gorselleri backfill islemi tamamlandi.", {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      defaultImage: DEFAULT_PRODUCT_IMAGE,
    });

    process.exit(0);
  } catch (error) {
    logger.error("Urun gorsel backfill islemi basarisiz.", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

runBackfill();
