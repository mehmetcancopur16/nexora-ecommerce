require("dotenv").config();

const { connectDB } = require("../config/db");
const User = require("../models/User.model");
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
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
];

const productTemplates = [
  { name: "Kablosuz Kulaklik X200", price: 2199, stock: 28, category: "Elektronik" },
  { name: "Mekanik Klavye RGB", price: 1799, stock: 20, category: "Elektronik" },
  { name: "4K Web Kamera", price: 1299, stock: 35, category: "Elektronik" },
  { name: "Akilli Saat Active", price: 3199, stock: 18, category: "Elektronik" },
  { name: "Robot Supurge Mini", price: 6899, stock: 9, category: "Ev & Yasam" },
  { name: "Bambu Kesme Tahtasi", price: 349, stock: 44, category: "Ev & Yasam" },
  { name: "Aromaterapi Difuzor", price: 799, stock: 22, category: "Ev & Yasam" },
  { name: "Ergonomik Ofis Lambasi", price: 599, stock: 26, category: "Ev & Yasam" },
  { name: "Yoga Mat Premium", price: 549, stock: 40, category: "Spor" },
  { name: "Direnc Band Seti", price: 289, stock: 60, category: "Spor" },
  { name: "Akilli Atlama Ipi", price: 459, stock: 32, category: "Spor" },
  { name: "Termal Spor Sulugu", price: 219, stock: 50, category: "Spor" },
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

async function runSeeder() {
  try {
    await connectDB();

    await Promise.all([User.deleteMany({}), Product.deleteMany({}), Category.deleteMany({})]);
    logger.info("Mevcut User, Product ve Category verileri temizlendi.");

    const createdUsers = await User.insertMany(seedUsers);
    logger.info(`${createdUsers.length} kullanici olusturuldu.`);

    const createdCategories = await Category.insertMany(seedCategories);
    const categoriesByName = new Map(createdCategories.map((category) => [category.name, category._id]));
    logger.info(`${createdCategories.length} kategori olusturuldu.`);

    const createdProducts = await Product.insertMany(buildProducts(categoriesByName));
    logger.info(`${createdProducts.length} urun olusturuldu.`);

    logger.info("Seeder islemi basariyla tamamlandi.");
    process.exit(0);
  } catch (error) {
    logger.error("Seeder calisirken hata olustu.", { message: error.message, stack: error.stack });
    process.exit(1);
  }
}

runSeeder();
