require("dotenv").config();

const { connectDB } = require("../config/db");
const User = require("../models/User.model");
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
const Cart = require("../models/Cart.model");
const Order = require("../models/Order.model");
const Review = require("../models/Review.model");
const logger = require("./logger");

const seedUsers = [
  {
    email: "admin@nexora.com",
    password: "Admin1234!",
    role: "admin",
    name: "Nexora Admin",
    address: { street: "Merkez Ofis", city: "Istanbul", zip: "34000" },
  },
  {
    email: "ayse.user@nexora.com",
    password: "User12345!",
    role: "user",
    name: "Ayse Kaya",
    address: { street: "Moda Caddesi", city: "Istanbul", zip: "34710" },
  },
  {
    email: "mehmet.user@nexora.com",
    password: "User12345!",
    role: "user",
    name: "Mehmet Demir",
    address: { street: "Kordon", city: "Izmir", zip: "35220" },
  },
];

const seedCategories = [
  { name: "Elektronik", description: "Teknoloji ve aksesuar urunleri" },
  { name: "Ev & Yasam", description: "Gundelik yasam ve ev urunleri" },
  { name: "Spor", description: "Spor ve outdoor urunleri" },
  { name: "Kisisel Bakim", description: "Gunluk kisisel bakim urunleri" },
];

const productTemplates = [
  { name: "Kablosuz Kulaklik X200", price: 2199, stock: 28, category: "Elektronik" },
  { name: "Mekanik Klavye RGB", price: 1799, stock: 20, category: "Elektronik" },
  { name: "4K Web Kamera", price: 1299, stock: 8, category: "Elektronik" },
  { name: "Akilli Saat Active", price: 3199, stock: 6, category: "Elektronik" },
  { name: "Robot Supurge Mini", price: 6899, stock: 4, category: "Ev & Yasam" },
  { name: "Bambu Kesme Tahtasi", price: 349, stock: 44, category: "Ev & Yasam" },
  { name: "Aromaterapi Difuzor", price: 799, stock: 22, category: "Ev & Yasam" },
  { name: "Ergonomik Ofis Lambasi", price: 599, stock: 26, category: "Ev & Yasam" },
  { name: "Yoga Mat Premium", price: 549, stock: 40, category: "Spor" },
  { name: "Direnc Band Seti", price: 289, stock: 60, category: "Spor" },
  { name: "Akilli Atlama Ipi", price: 459, stock: 32, category: "Spor" },
  { name: "Termal Spor Sulugu", price: 219, stock: 50, category: "Spor" },
  { name: "Nemlendirici Bakim Kremi", price: 189, stock: 70, category: "Kisisel Bakim" },
  { name: "Yuz Temizleme Jeli", price: 149, stock: 55, category: "Kisisel Bakim" },
  { name: "Elektrikli Dis Fircasi", price: 999, stock: 11, category: "Kisisel Bakim" },
];

function buildProducts(categoriesByName) {
  return productTemplates.map((template, index) => {
    const categoryId = categoriesByName.get(template.category);
    return {
      name: template.name,
      description: `${template.name} urunu icin demo aciklamasi.`,
      price: template.price,
      stock: template.stock,
      category: categoryId,
      images: [`/uploads/products/product-${index + 1}.jpg`],
      isActive: true,
    };
  });
}

function pickProduct(products, index) {
  return products[index % products.length];
}

function buildCarts(users, products) {
  const normalUsers = users.filter((user) => user.role === "user");
  return normalUsers.map((user, index) => ({
    user: user._id,
    items: [
      { product: pickProduct(products, index)._id, quantity: 1 + (index % 2) },
      { product: pickProduct(products, index + 3)._id, quantity: 2 },
    ],
  }));
}

function buildOrders(users, products) {
  const normalUsers = users.filter((user) => user.role === "user");
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

  return statuses.map((status, index) => {
    const user = normalUsers[index % normalUsers.length];
    const firstProduct = pickProduct(products, index);
    const secondProduct = pickProduct(products, index + 5);
    const items = [
      { product: firstProduct._id, quantity: 1 + (index % 3), price: firstProduct.price },
      { product: secondProduct._id, quantity: 1, price: secondProduct.price },
    ];
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return {
      user: user._id,
      items,
      totalAmount,
      status,
      shippingAddress: user.address || { street: "Bilinmiyor", city: "Istanbul", zip: "34000" },
    };
  });
}

function buildReviews(users, products) {
  const normalUsers = users.filter((user) => user.role === "user");
  const ratings = [5, 4, 3, 2, 1, 5, 4, 2];

  return ratings.map((rating, index) => {
    const user = normalUsers[index % normalUsers.length];
    const product = pickProduct(products, index + 1);

    return {
      user: user._id,
      product: product._id,
      rating,
      comment: `Demo yorum ${index + 1}: puan ${rating}/5`,
    };
  });
}

async function addWishlistData(users, products) {
  const normalUsers = users.filter((user) => user.role === "user");

  await Promise.all(
    normalUsers.map((user, index) =>
      User.updateOne(
        { _id: user._id },
        {
          $set: {
            wishlist: [pickProduct(products, index + 2)._id, pickProduct(products, index + 7)._id],
          },
        }
      )
    )
  );
}

async function runSeeder() {
  try {
    await connectDB();

    await Promise.all([
      Review.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      User.deleteMany({}),
    ]);
    logger.info("Mevcut User, Category, Product, Cart, Order ve Review verileri temizlendi.");

    const createdUsers = await User.create(seedUsers);
    logger.info(`${createdUsers.length} kullanici olusturuldu.`);

    const createdCategories = await Category.insertMany(seedCategories);
    const categoriesByName = new Map(createdCategories.map((category) => [category.name, category._id]));
    logger.info(`${createdCategories.length} kategori olusturuldu.`);

    const createdProducts = await Product.insertMany(buildProducts(categoriesByName));
    logger.info(`${createdProducts.length} urun olusturuldu.`);

    await addWishlistData(createdUsers, createdProducts);
    logger.info("Wishlist verileri olusturuldu.");

    const createdCarts = await Cart.insertMany(buildCarts(createdUsers, createdProducts));
    logger.info(`${createdCarts.length} sepet olusturuldu.`);

    const createdOrders = await Order.insertMany(buildOrders(createdUsers, createdProducts));
    logger.info(`${createdOrders.length} siparis olusturuldu.`);

    const createdReviews = await Review.create(buildReviews(createdUsers, createdProducts));
    logger.info(`${createdReviews.length} yorum olusturuldu.`);

    const refreshedProducts = await Product.find({}).select("_id");
    await Promise.all(
      refreshedProducts.map((product) => Review.calcAverageRatings(product._id))
    );
    logger.info("Urun puan ve yorum metrikleri guncellendi.");

    logger.info("Seeder islemi basariyla tamamlandi.");
    process.exit(0);
  } catch (error) {
    logger.error("Seeder calisirken hata olustu.", { message: error.message, stack: error.stack });
    process.exit(1);
  }
}

runSeeder();
