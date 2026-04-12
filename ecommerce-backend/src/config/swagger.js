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
              description: { type: "string" },
              price: { type: "number", example: 99.9 },
              stock: { type: "integer", example: 12 },
              category: { $ref: "#/components/schemas/Category" },
              images: { type: "array", items: { type: "string" } },
              isActive: { type: "boolean", example: true },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
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
        },
      },
    },
    apis: [path.join(__dirname, "../routes/*.js")],
  });
}

module.exports = { buildSwaggerSpec };
