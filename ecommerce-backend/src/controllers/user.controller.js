const User = require("../models/User.model");
const Product = require("../models/Product.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  res.json({ success: true, data: user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  if (req.body.firstName !== undefined) {
    user.firstName = req.body.firstName;
  }

  if (req.body.lastName !== undefined) {
    user.lastName = req.body.lastName;
  }

  if (req.body.phone !== undefined) {
    user.phone = req.body.phone;
  }

  if (req.body.address) {
    user.address = {
      ...user.address?.toObject?.(),
      ...req.body.address,
    };
  }

  await user.save();

  res.json({ success: true, data: user });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, "Mevcut şifre hatalı", true);
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: "Şifre başarıyla güncellendi",
  });
});

exports.getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("wishlist")
    .populate({
      path: "wishlist",
      select: "name price images stock averageRating numOfReviews isActive",
    });

  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  res.json({
    success: true,
    data: user.wishlist,
  });
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId, isActive: true }).select("_id");
  if (!product) {
    throw new ApiError(404, "Ürün bulunamadı", true);
  }

  const user = await User.findById(req.user.id).select("wishlist");

  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  const exists = user.wishlist.some((item) => String(item) === String(productId));

  if (exists) {
    user.wishlist = user.wishlist.filter((item) => String(item) !== String(productId));
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  await user.populate({
    path: "wishlist",
    select: "name price images stock averageRating numOfReviews isActive",
  });

  res.json({
    success: true,
    message: exists ? "Ürün favorilerden kaldırıldı" : "Ürün favorilere eklendi",
    data: user.wishlist,
  });
});

exports.getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("addresses");
  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }
  res.json({ success: true, data: user.addresses || [] });
});

exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("addresses address");
  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  const payload = req.body;
  if (payload.isDefault) {
    user.addresses = (user.addresses || []).map((item) => ({ ...item.toObject(), isDefault: false }));
  }

  user.addresses.push(payload);

  if (payload.isDefault || user.addresses.length === 1) {
    user.address = {
      street: payload.street,
      city: payload.city,
      zip: payload.zip,
      country: payload.country,
      label: payload.label,
      isDefault: true,
    };
  }

  await user.save();
  res.status(201).json({ success: true, data: user.addresses });
});

exports.updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("addresses address");
  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }

  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    throw new ApiError(404, "Adres bulunamadı", true);
  }

  Object.assign(address, req.body);
  if (req.body.isDefault) {
    user.addresses.forEach((item) => {
      if (String(item._id) !== String(address._id)) {
        item.isDefault = false;
      }
    });
  }

  if (address.isDefault) {
    user.address = {
      street: address.street,
      city: address.city,
      zip: address.zip,
      country: address.country,
      label: address.label,
      isDefault: true,
    };
  }

  await user.save();
  res.json({ success: true, data: user.addresses });
});

exports.deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("addresses");
  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }
  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    throw new ApiError(404, "Adres bulunamadı", true);
  }
  const wasDefault = address.isDefault;
  address.deleteOne();
  if (wasDefault && user.addresses.length) {
    user.addresses[0].isDefault = true;
  }
  await user.save();
  res.json({ success: true, data: user.addresses });
});

exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("addresses address");
  if (!user) {
    throw new ApiError(404, "Kullanıcı bulunamadı", true);
  }
  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    throw new ApiError(404, "Adres bulunamadı", true);
  }
  user.addresses.forEach((item) => {
    item.isDefault = String(item._id) === String(address._id);
  });
  user.address = {
    street: address.street,
    city: address.city,
    zip: address.zip,
    country: address.country,
    label: address.label,
    isDefault: true,
  };
  await user.save();
  res.json({ success: true, data: user.addresses });
});
