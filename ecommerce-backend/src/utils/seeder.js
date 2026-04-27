require("dotenv").config();

const { connectDB } = require("../config/db");
const User = require("../models/User.model");
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
const Cart = require("../models/Cart.model");
const Order = require("../models/Order.model");
const Review = require("../models/Review.model");
const Coupon = require("../models/Coupon.model");
const ContactMessage = require("../models/ContactMessage.model");
const Notification = require("../models/Notification.model");
const PaymentMethod = require("../models/PaymentMethod.model");
const ReturnRequest = require("../models/ReturnRequest.model");
const NewsletterSubscriber = require("../models/NewsletterSubscriber.model");
const StoreSettings = require("../models/StoreSettings.model");
const logger = require("./logger");

const seedUsers = [
  {
    email: "admin@nexora.com",
    password: "Admin1234!",
    role: "admin",
    firstName: "Nexora",
    lastName: "Admin",
    phone: "+905551110001",
    address: {
      openAddress: "Merkez Ofis",
      city: "İstanbul",
      district: "Kadıköy",
      postalCode: "34000",
      country: "Türkiye",
      street: "Merkez Ofis",
      zip: "34000",
    },
  },
  {
    email: "ayse.user@nexora.com",
    password: "User12345!",
    role: "user",
    firstName: "Ayse",
    lastName: "Kaya",
    phone: "+905551110002",
    address: {
      openAddress: "Moda Caddesi",
      city: "İstanbul",
      district: "Kadıköy",
      postalCode: "34710",
      country: "Türkiye",
      street: "Moda Caddesi",
      zip: "34710",
    },
  },
  {
    email: "mehmet.user@nexora.com",
    password: "User12345!",
    role: "user",
    firstName: "Mehmet",
    lastName: "Demir",
    phone: "+905551110003",
    address: {
      openAddress: "Kordon",
      city: "İzmir",
      district: "Konak",
      postalCode: "35220",
      country: "Türkiye",
      street: "Kordon",
      zip: "35220",
    },
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
      images: ["/uploads/products/demo-product.svg"],
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
  const paymentStatuses = ["pending_payment", "paid", "failed", "paid", "paid"];
  const paymentMethods = ["mock_card", "bank_transfer", "cash_on_delivery", "mock_card", "mock_card"];

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
      paymentStatus: paymentStatuses[index % paymentStatuses.length],
      paymentMethod: paymentMethods[index % paymentMethods.length],
      orderNumber: `NXR-SEED-${Date.now()}-${index + 1}`,
      shippingAddress: user.address
        ? {
            openAddress: user.address.openAddress || user.address.street || "Bilinmiyor",
            city: user.address.city || "İstanbul",
            district: user.address.district || "Kadıköy",
            postalCode: user.address.postalCode || user.address.zip || "34000",
            country: user.address.country || "Türkiye",
            street: user.address.street || user.address.openAddress || "Bilinmiyor",
            zip: user.address.zip || user.address.postalCode || "34000",
          }
        : {
            openAddress: "Bilinmiyor",
            city: "İstanbul",
            district: "Kadıköy",
            postalCode: "34000",
            country: "Türkiye",
            street: "Bilinmiyor",
            zip: "34000",
          },
      customer: {
        firstName: user.firstName || "Demo",
        lastName: user.lastName || "Kullanici",
        email: user.email,
        phone: user.phone || "+905550000000",
      },
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
      moderationStatus: index % 3 === 0 ? "rejected" : "approved",
      isHidden: index % 4 === 0,
    };
  });
}

function buildCoupons() {
  const now = Date.now();
  return [
    {
      code: "WELCOME10",
      description: "Yeni kullanici indirimi",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 250,
      usageLimit: 500,
      usedCount: 42,
      startsAt: new Date(now - 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(now + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      code: "FIX150",
      description: "Sabit tutar indirimi",
      discountType: "fixed",
      discountValue: 150,
      minOrderAmount: 1000,
      maxDiscountAmount: null,
      usageLimit: 200,
      usedCount: 12,
      startsAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(now + 15 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      code: "EXPIRED25",
      description: "Suresi gecmis kampanya",
      discountType: "percentage",
      discountValue: 25,
      minOrderAmount: 500,
      usageLimit: 100,
      usedCount: 100,
      startsAt: new Date(now - 90 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(now - 30 * 24 * 60 * 60 * 1000),
      isActive: false,
    },
  ];
}

function buildStoreSettings() {
  return {
    storeName: "Nexora",
    supportEmail: "support@nexora.com",
    supportPhone: "+90 212 000 00 00",
    currency: "TRY",
    maintenanceMode: false,
    allowGuestCheckout: true,
    lowStockThreshold: 12,
  };
}

function buildSupportMessages(users) {
  const admin = users.find((u) => u.role === "admin");
  const normalUsers = users.filter((u) => u.role === "user");
  return normalUsers.map((user, index) => ({
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    category: ["siparis", "urun", "teknik", "diger"][index % 4],
    subject: `Destek Talebi #${index + 1}`,
    message: `Merhaba, test amacli destek mesaji ${index + 1}.`,
    source: "support",
    adminStatus: ["open", "in_progress", "resolved"][index % 3],
    resolvedAt: index % 3 === 2 ? new Date() : null,
    resolvedBy: index % 3 === 2 ? admin?._id || null : null,
  }));
}

function buildNotifications(users) {
  const normalUsers = users.filter((u) => u.role === "user");
  const types = ["order", "security", "promotion", "system"];
  const payload = [];
  normalUsers.forEach((user, idx) => {
    types.forEach((type, i) => {
      payload.push({
        user: user._id,
        type,
        title: `${type.toUpperCase()} bildirimi`,
        message: `Demo ${type} bildirimi ${idx + 1}-${i + 1}`,
        isRead: i % 2 === 0,
        readAt: i % 2 === 0 ? new Date() : null,
        metadata: { seed: true, index: `${idx}-${i}` },
      });
    });
  });
  return payload;
}

function buildPaymentMethods(users) {
  const normalUsers = users.filter((u) => u.role === "user");
  return normalUsers.flatMap((user, idx) => [
    {
      user: user._id,
      provider: "mock",
      methodType: "card",
      holderName: `${user.firstName} ${user.lastName}`.trim(),
      brand: "VISA",
      last4: `${(1111 + idx).toString().slice(-4)}`,
      expiryMonth: 12,
      expiryYear: 2030,
      tokenRef: `seed-token-${idx}-1`,
      isDefault: true,
      isActive: true,
    },
    {
      user: user._id,
      provider: "mock",
      methodType: "bank_transfer",
      holderName: `${user.firstName} ${user.lastName}`.trim(),
      brand: "BANK",
      last4: `${(2222 + idx).toString().slice(-4)}`,
      expiryMonth: 1,
      expiryYear: 2031,
      tokenRef: `seed-token-${idx}-2`,
      isDefault: false,
      isActive: true,
    },
  ]);
}

function buildReturns(users, orders) {
  const normalUsers = users.filter((u) => u.role === "user");
  const userReturns = [];
  const statuses = ["requested", "approved", "rejected", "refunded"];
  normalUsers.forEach((user, index) => {
    const order = orders.find((item) => String(item.user) === String(user._id));
    if (!order?.items?.length) return;
    userReturns.push({
      user: user._id,
      order: order._id,
      status: statuses[index % statuses.length],
      note: "Seeder kaynakli test iade talebi",
      resolvedAt: index % statuses.length > 0 ? new Date() : null,
      items: [
        {
          orderItemId: String(order.items[0]._id || `item-${index}`),
          quantity: 1,
          reason: "Seeder iade testi",
        },
      ],
    });
  });
  return userReturns;
}

function buildNewsletterSubscribers(users) {
  const normalUsers = users.filter((u) => u.role === "user");
  return normalUsers.map((u, index) => ({
    email: u.email,
    source: index % 2 === 0 ? "home" : "footer",
  }));
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
    const args = process.argv.slice(2);
    const force = args.includes("--force");
    if (process.env.NODE_ENV === "production" && !force) {
      logger.error("Seeder production ortaminda --force olmadan calistirilamaz.");
      process.exit(1);
    }

    await connectDB();

    await Promise.all([
      NewsletterSubscriber.deleteMany({}),
      ReturnRequest.deleteMany({}),
      PaymentMethod.deleteMany({}),
      Notification.deleteMany({}),
      ContactMessage.deleteMany({}),
      StoreSettings.deleteMany({}),
      Coupon.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      User.deleteMany({}),
    ]);
    logger.info("Tüm seed kapsamindaki koleksiyonlar temizlendi.");

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

    const createdCoupons = await Coupon.insertMany(buildCoupons());
    logger.info(`${createdCoupons.length} kupon olusturuldu.`);

    const settings = await StoreSettings.create(buildStoreSettings());
    logger.info(`Magaza ayarlari olusturuldu: ${settings.storeName}`);

    const createdSupportMessages = await ContactMessage.insertMany(buildSupportMessages(createdUsers));
    logger.info(`${createdSupportMessages.length} destek mesaji olusturuldu.`);

    const createdNotifications = await Notification.insertMany(buildNotifications(createdUsers));
    logger.info(`${createdNotifications.length} bildirim olusturuldu.`);

    const createdPaymentMethods = await PaymentMethod.insertMany(buildPaymentMethods(createdUsers));
    logger.info(`${createdPaymentMethods.length} odeme yontemi olusturuldu.`);

    const createdReturns = await ReturnRequest.insertMany(buildReturns(createdUsers, createdOrders));
    logger.info(`${createdReturns.length} iade talebi olusturuldu.`);

    const createdSubscribers = await NewsletterSubscriber.insertMany(buildNewsletterSubscribers(createdUsers));
    logger.info(`${createdSubscribers.length} newsletter aboneligi olusturuldu.`);

    logger.info("Seeder islemi basariyla tamamlandi.");
    process.exit(0);
  } catch (error) {
    logger.error("Seeder calisirken hata olustu.", { message: error.message, stack: error.stack });
    process.exit(1);
  }
}

runSeeder();
