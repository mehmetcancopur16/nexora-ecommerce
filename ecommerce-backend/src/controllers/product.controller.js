const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

exports.getAllProducts = asyncHandler(async (req, res) => {
  const { page, limit, category, search } = req.query;
  const skip = (page - 1) * limit;

  const filter = { isActive: true };
  if (category) {
    filter.category = new mongoose.Types.ObjectId(category);
  }
  if (search && search.length > 0) {
    filter.$text = { $search: search };
  }

  let query = Product.find(filter);
  if (search && search.length > 0) {
    query = query.select({ score: { $meta: "textScore" } });
    query = query.sort({ score: { $meta: "textScore" } });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const [items, total] = await Promise.all([
    query
      .skip(skip)
      .limit(limit)
      .populate({ path: "category", select: "name description" })
      .lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  res.json({
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
});

exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Geçersiz ürün kimliği", true);
  }

  const product = await Product.findOne({ _id: id, isActive: true })
    .populate({ path: "category", select: "name description" })
    .lean();

  if (!product) {
    throw new ApiError(404, "Ürün bulunamadı", true);
  }

  res.json({ success: true, data: product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const categoryExists = await Category.exists({ _id: req.body.category });
  if (!categoryExists) {
    throw new ApiError(400, "Geçersiz kategori", true);
  }

  const product = await Product.create(req.body);
  await product.populate({ path: "category", select: "name description" });

  res.status(201).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Geçersiz ürün kimliği", true);
  }

  if (req.body.category) {
    const categoryExists = await Category.exists({ _id: req.body.category });
    if (!categoryExists) {
      throw new ApiError(400, "Geçersiz kategori", true);
    }
  }

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate({ path: "category", select: "name description" });

  if (!product) {
    throw new ApiError(404, "Ürün bulunamadı", true);
  }

  res.json({ success: true, data: product });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Geçersiz ürün kimliği", true);
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).populate({ path: "category", select: "name description" });

  if (!product) {
    throw new ApiError(404, "Ürün bulunamadı", true);
  }

  res.json({
    success: true,
    message: "Ürün pasifleştirildi (soft delete)",
    data: product,
  });
});

exports.uploadProductImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Geçersiz ürün kimliği", true);
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Yüklenecek en az bir görsel gerekli", true);
  }

  const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

  const product = await Product.findByIdAndUpdate(
    id,
    { $push: { images: { $each: imageUrls } } },
    { new: true, runValidators: true }
  ).populate({ path: "category", select: "name description" });

  if (!product) {
    throw new ApiError(404, "Ürün bulunamadı", true);
  }

  res.json({
    success: true,
    message: "Ürün görselleri başarıyla yüklendi",
    data: product,
  });
});
