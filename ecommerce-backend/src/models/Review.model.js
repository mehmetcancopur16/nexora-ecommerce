const mongoose = require("mongoose");
const Product = require("./Product.model");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function calcAverageRatings(productId) {
  const stats = await this.aggregate([
    {
      $match: { product: new mongoose.Types.ObjectId(productId) },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Number(stats[0].averageRating.toFixed(1)),
      numOfReviews: stats[0].numOfReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      numOfReviews: 0,
    });
  }
};

reviewSchema.post("save", function postSave() {
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.post("findOneAndDelete", async function postFindOneAndDelete(doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.product);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
