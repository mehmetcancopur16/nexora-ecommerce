const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

function buildSwaggerSpec() {
  return swaggerJsdoc({
    definition: {
      openapi: "3.0.3",
      info: {
        title: "Nexora E-Commerce API",
        version: "1.0.0",
        description:
          "Kategori ve ürün uçları. Liste ve detay herkese açıktır; oluşturma, güncelleme ve silme (soft delete) için `admin` rolü ve Bearer JWT gereklidir.",
      },
      servers: [
        { url: "http://localhost:5000", description: "Local development" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Authorization başlığı: `Bearer <token>`",
          },
        },
        schemas: {
          UserMinimal: {
            type: "object",
            properties: {
              _id: { type: "string" },
              email: { type: "string", example: "user@nexora.com" },
              role: { type: "string", example: "user" },
              name: { type: "string", example: "Nexora User" },
              address: { $ref: "#/components/schemas/Address" },
            },
          },
          Address: {
            type: "object",
            properties: {
              label: { type: "string", example: "Ev" },
              city: { type: "string", example: "İstanbul" },
              district: { type: "string", example: "Kadıköy" },
              postalCode: { type: "string", example: "34000" },
              openAddress: { type: "string", example: "Atatürk Caddesi No: 10" },
              country: { type: "string", example: "Türkiye" },
              street: { type: "string", example: "Atatürk Caddesi 10" },
              zip: { type: "string", example: "34000" },
            },
          },
          ProfileUpdate: {
            type: "object",
            properties: {
              firstName: { type: "string", example: "Mehmet" },
              lastName: { type: "string", example: "Can" },
              phone: { type: "string", example: "+905551112233" },
              address: { $ref: "#/components/schemas/Address" },
            },
          },
          PasswordUpdate: {
            type: "object",
            required: ["currentPassword", "newPassword"],
            properties: {
              currentPassword: { type: "string", example: "CurrentPass123" },
              newPassword: {
                type: "string",
                example: "NewSecurePass123",
                description: "En az 8 karakter, en az 1 büyük harf, 1 küçük harf, 1 rakam",
              },
            },
          },
          AdminUserUpdate: {
            type: "object",
            properties: {
              role: { type: "string", enum: ["user", "admin"] },
              isActive: { type: "boolean", example: false },
            },
          },
          Category: {
            type: "object",
            properties: {
              _id: { type: "string", example: "6620f0b2f25d1a0012ab3c45" },
              name: { type: "string", example: "Elektronik" },
              description: { type: "string", example: "Elektronik ürünler" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          Product: {
            type: "object",
            properties: {
              _id: { type: "string" },
              name: { type: "string" },
              slug: { type: "string" },
              sku: { type: "string" },
              brand: { type: "string" },
              description: { type: "string" },
              price: { type: "number", example: 99.9 },
              stock: { type: "integer", example: 12 },
              category: { $ref: "#/components/schemas/Category" },
              images: { type: "array", items: { type: "string" } },
              tags: { type: "array", items: { type: "string" } },
              specs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: { type: "string" },
                    value: { type: "string" },
                  },
                },
              },
              variants: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    value: { type: "string" },
                    sku: { type: "string" },
                    price: { type: "number" },
                    stock: { type: "integer" },
                    images: { type: "array", items: { type: "string" } },
                  },
                },
              },
              metadata: { type: "object" },
              shippingInfo: { type: "object" },
              warrantyInfo: { type: "string" },
              returnPolicySnippet: { type: "string" },
              seo: { type: "object" },
              averageRating: { type: "number", example: 4.3, minimum: 0, maximum: 5 },
              numOfReviews: { type: "integer", example: 18, minimum: 0 },
              isActive: { type: "boolean", example: true },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          CartItem: {
            type: "object",
            properties: {
              product: { $ref: "#/components/schemas/Product" },
              quantity: { type: "integer", example: 2 },
            },
          },
          Cart: {
            type: "object",
            properties: {
              _id: { type: "string" },
              user: { type: "string" },
              items: {
                type: "array",
                items: { $ref: "#/components/schemas/CartItem" },
              },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          ShippingAddress: {
            type: "object",
            required: ["city", "district", "postalCode", "openAddress", "country"],
            properties: {
              city: { type: "string", example: "İstanbul" },
              district: { type: "string", example: "Kadıköy" },
              postalCode: { type: "string", example: "34000" },
              openAddress: { type: "string", example: "Atatürk Caddesi No: 10" },
              country: { type: "string", example: "Türkiye" },
              street: { type: "string", example: "Atatürk Caddesi 10" },
              zip: { type: "string", example: "34000" },
            },
          },
          OrderItem: {
            type: "object",
            properties: {
              product: { $ref: "#/components/schemas/Product" },
              quantity: { type: "integer", example: 2 },
              price: { type: "number", example: 199.99 },
            },
          },
          Order: {
            type: "object",
            properties: {
              _id: { type: "string" },
              user: {
                oneOf: [
                  { type: "string" },
                  { $ref: "#/components/schemas/UserMinimal" },
                ],
              },
              items: {
                type: "array",
                items: { $ref: "#/components/schemas/OrderItem" },
              },
              totalAmount: { type: "number", example: 399.98 },
              status: {
                type: "string",
                enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
              },
              shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          CreateOrderBody: {
            type: "object",
            required: ["shippingAddress", "customer"],
            properties: {
              shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
              customer: {
                type: "object",
                required: ["firstName", "lastName", "email", "phone"],
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string", format: "email" },
                  phone: { type: "string" },
                },
              },
              paymentMethod: {
                type: "string",
                enum: ["mock_card", "bank_transfer", "cash_on_delivery"],
                default: "mock_card",
              },
            },
          },
          PayMockOrderBody: {
            type: "object",
            required: ["paymentMethod"],
            properties: {
              paymentMethod: {
                type: "string",
                enum: ["mock_card", "bank_transfer", "cash_on_delivery"],
              },
              mockCard: {
                type: "object",
                properties: {
                  holderName: { type: "string", example: "MEHMET CAN" },
                  number: { type: "string", example: "4111111111111111" },
                  expiry: { type: "string", example: "12/30" },
                  cvc: { type: "string", example: "123" },
                },
              },
            },
          },
          OrderStatusUpdate: {
            type: "object",
            required: ["status"],
            properties: {
              status: {
                type: "string",
                enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
              },
            },
          },
          Review: {
            type: "object",
            properties: {
              _id: { type: "string" },
              user: {
                oneOf: [
                  { type: "string" },
                  { $ref: "#/components/schemas/UserMinimal" },
                ],
              },
              product: {
                oneOf: [
                  { type: "string" },
                  { $ref: "#/components/schemas/Product" },
                ],
              },
              rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
              comment: { type: "string", example: "Harika bir ürün." },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          ReviewCreate: {
            type: "object",
            required: ["product", "rating"],
            properties: {
              product: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
              rating: { type: "integer", minimum: 1, maximum: 5 },
              comment: { type: "string" },
            },
          },
          WishlistResponse: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          OrderStatusBreakdown: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
              },
              count: { type: "integer", example: 12 },
            },
          },
          LowStockProduct: {
            type: "object",
            properties: {
              _id: { type: "string" },
              name: { type: "string", example: "Nexora Kulaklık" },
              stock: { type: "integer", example: 4 },
              price: { type: "number", example: 999.9 },
              category: { type: "string" },
            },
          },
          AdminDashboardStats: {
            type: "object",
            properties: {
              totalUsers: { type: "integer", example: 145 },
              totalOrders: { type: "integer", example: 420 },
              totalRevenue: { type: "number", example: 125000.5 },
              orderStatusDistribution: {
                type: "array",
                items: { $ref: "#/components/schemas/OrderStatusBreakdown" },
              },
              lowStockProducts: {
                type: "array",
                items: { $ref: "#/components/schemas/LowStockProduct" },
              },
              activeCouponCount: { type: "integer", example: 6 },
              openSupportCount: { type: "integer", example: 4 },
              lowStockThreshold: { type: "integer", example: 10 },
            },
          },
          AddressCreate: {
            type: "object",
            required: ["city", "district", "postalCode", "openAddress"],
            properties: {
              label: { type: "string", example: "Ev" },
              city: { type: "string", example: "İstanbul" },
              district: { type: "string", example: "Kadıköy" },
              postalCode: { type: "string", example: "34000" },
              openAddress: { type: "string", example: "Rıhtım Cad. No:12" },
              country: { type: "string", example: "Türkiye" },
              isDefault: { type: "boolean", example: false },
              street: { type: "string", example: "Rıhtım Cad." },
              zip: { type: "string", example: "34000" },
            },
          },
          AddressUpdate: {
            allOf: [{ $ref: "#/components/schemas/AddressCreate" }],
          },
          NotificationPreferences: {
            type: "object",
            properties: {
              orderUpdates: { type: "boolean", example: true },
              promotions: { type: "boolean", example: false },
              securityAlerts: { type: "boolean", example: true },
              productNews: { type: "boolean", example: false },
            },
          },
          PaymentMethodCreate: {
            type: "object",
            required: ["provider", "tokenRef", "last4", "expiryMonth", "expiryYear"],
            properties: {
              provider: { type: "string", enum: ["mock"] },
              tokenRef: { type: "string", example: "card_tok_123" },
              brand: { type: "string", example: "VISA" },
              last4: { type: "string", example: "1111" },
              holderName: { type: "string", example: "MEHMET CAN" },
              expiryMonth: { type: "integer", example: 12 },
              expiryYear: { type: "integer", example: 2030 },
              isDefault: { type: "boolean", example: false },
            },
          },
          ReturnRequestCreate: {
            type: "object",
            required: ["orderId", "items"],
            properties: {
              orderId: { type: "string" },
              note: { type: "string", example: "Paket teslimde hasarlıydı" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["orderItemId", "quantity", "reason"],
                  properties: {
                    orderItemId: { type: "string" },
                    quantity: { type: "integer", minimum: 1, example: 1 },
                    reason: { type: "string", example: "Kutu ezik" },
                  },
                },
              },
            },
          },
          ReturnStatusUpdate: {
            type: "object",
            required: ["status"],
            properties: {
              status: { type: "string", enum: ["requested", "approved", "rejected", "refunded"] },
              adminNote: { type: "string" },
            },
          },
          Pagination: {
            type: "object",
            properties: {
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 10 },
              total: { type: "integer", example: 42 },
              totalPages: { type: "integer", example: 5 },
            },
          },
          ErrorResponse: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              statusCode: { type: "integer", example: 400 },
              message: { type: "string" },
            },
          },
          SuccessMessage: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Islem basariyla tamamlandi" },
            },
          },
        },
      },
    },
    apis: [path.join(__dirname, "../routes/*.js"), path.join(__dirname, "../app.js")],
  });
}

module.exports = { buildSwaggerSpec };
