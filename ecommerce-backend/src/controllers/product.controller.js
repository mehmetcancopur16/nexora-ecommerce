const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeProductPayload = (payload = {}) => {
  const next = { ...payload };
  if (next.slug) {
    next.slug = String(next.slug)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  if (next.sku) {
    next.sku = String(next.sku).trim().toUpperCase();
  }
  if (Array.isArray(next.tags)) {
    next.tags = next.tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean);
  }
  return next;
};

const isAdminFromRequest = async (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return false;
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token || !process.env.JWT_SECRET) {
    return false;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const id = payload.sub ?? payload.id ?? payload._id;
    if (!id) return false;
    const user = await User.findById(id).select("role isActive").lean();
    return Boolean(user?.isActive && user?.role === "admin");
  } catch {
    return false;
  }
};

function resolveProductListSort(sortParam, hasTextSearch) {
  switch (sortParam) {
    case "price_asc":
      return { price: 1 };
    case "price_desc":
      return { price: -1 };
    case "name_asc":
      return { name: 1 };
    case "name_desc":
      return { name: -1 };
    case "relevance":
      return hasTextSearch ? { score: { $meta: "textScore" } } : { createdAt: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
}

exports.getAllProducts = asyncHandler(async (req, res) => {
  const { page, limit, category, search, startsWith, includeInactive, sort, active } = req.query;
  const skip = (page - 1) * limit;
  const isAdmin = await isAdminFromRequest(req);
  const canIncludeInactive = isAdmin && includeInactive === true;

  const filter = {};
  if (!canIncludeInactive) {
    filter.isActive = true;
  } else if (active === "active") {
    filter.isActive = true;
  } else if (active === "inactive") {
    filter.isActive = false;
  }
  if (category) {
    filter.category = new mongoose.Types.ObjectId(category);
  }
  const hasPrefixFilter = Boolean(startsWith && startsWith.length > 0);
  if (hasPrefixFilter) {
    filter.name = { $regex: `^${escapeRegex(startsWith)}`, $options: "i" };
  }
  const hasTextSearch = !hasPrefixFilter && Boolean(search && search.length > 0);
  if (hasTextSearch) {
    filter.$text = { $search: search };
  }

  const effectiveSort = sort ?? (hasTextSearch ? "relevance" : "newest");
  const sortKey = resolveProductListSort(effectiveSort, hasTextSearch);
  const useTextScoreSort = hasTextSearch && effectiveSort === "relevance";

  let query = Product.find(filter);
  if (useTextScoreSort) {
    query = query.select({ score: { $meta: "textScore" } });
  }
  query = query.sort(sortKey);

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
  const payload = normalizeProductPayload(req.body);
  const categoryExists = await Category.exists({ _id: payload.category });
  if (!categoryExists) {
    throw new ApiError(400, "Geçersiz kategori", true);
  }

  const product = await Product.create(payload);
  await product.populate({ path: "category", select: "name description" });

  res.status(201).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Geçersiz ürün kimliği", true);
  }

  const payload = normalizeProductPayload(req.body);
  if (payload.category) {
    const categoryExists = await Category.exists({ _id: payload.category });
    if (!categoryExists) {
      throw new ApiError(400, "Geçersiz kategori", true);
    }
  }

  const product = await Product.findByIdAndUpdate(id, payload, {
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

  const imageUrls = req.files.map((file) => `/uploads/products/${file.filename}`);

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

exports.getRelatedProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const limitRaw = Number(req.query.limit || 8);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(24, limitRaw)) : 8;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Geçersiz ürün kimliği", true);
  }

  const product = await Product.findOne({ _id: id, isActive: true }).select("category").lean();
  if (!product) {
    throw new ApiError(404, "Ürün bulunamadı", true);
  }

  const baseFilter = {
    isActive: true,
    _id: { $ne: new mongoose.Types.ObjectId(id) },
  };

  let items = [];
  if (product.category) {
    items = await Product.find({
      ...baseFilter,
      category: product.category,
    })
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(limit)
      .populate({ path: "category", select: "name description" })
      .lean();
  }

  if (items.length < limit) {
    const missing = limit - items.length;
    const existingIds = items.map((item) => item._id);
    const fallback = await Product.find({
      ...baseFilter,
      ...(existingIds.length ? { _id: { $nin: [new mongoose.Types.ObjectId(id), ...existingIds] } } : {}),
    })
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(missing)
      .populate({ path: "category", select: "name description" })
      .lean();
    items = [...items, ...fallback];
  }

  res.json({ success: true, data: items });
});
