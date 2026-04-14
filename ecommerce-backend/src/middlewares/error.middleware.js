const mongoose = require("mongoose");
const { ZodError } = require("zod");
const ApiError = require("../utils/apiError");
const logger = require("../utils/logger");

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Kaynak bulunamadı: ${req.originalUrl}`, true));
}

function mapMongooseValidation(err) {
  const messages = Object.values(err.errors || {}).map((e) => e.message);
  return messages.length ? messages.join(", ") : "Doğrulama hatası";
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let error = err;
  let statusCode = err.statusCode || 500;

  if (err instanceof ZodError) {
    statusCode = 400;
    error = new ApiError(400, "Geçersiz istek gövdesi veya parametreler", true);
    error.details = err.flatten();
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    error = new ApiError(400, "Geçersiz kimlik formatı", true);
  } else if (err.code === 11000) {
    statusCode = 409;
    error = new ApiError(409, "Bu kayıt zaten mevcut", true);
  } else if (err.name === "MongoServerSelectionError") {
    statusCode = 503;
    error = new ApiError(503, "Veritabani servisine ulasilamiyor", false);
  } else if (err.name === "MongoServerError") {
    statusCode = 500;
    error = new ApiError(500, "Veritabani islemi sirasinda bir hata olustu", false);
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    error = new ApiError(400, mapMongooseValidation(err), true);
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    error = new ApiError(401, "Geçersiz veya eksik token", true);
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    error = new ApiError(401, "Token süresi dolmuş", true);
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    error = err;
  } else {
    statusCode = 500;
    error = new ApiError(500, "Sunucu hatası", false);
  }

  logger.error(err.message, {
    path: req.originalUrl,
    method: req.method,
    statusCode,
    stack: err.stack,
    name: err.name,
  });

  const body = {
    success: false,
    statusCode,
    message: error.message,
  };

  if (error.details) {
    body.details = error.details;
  }

  if (process.env.NODE_ENV === "development" && err.stack) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

module.exports = { errorHandler, notFoundHandler };
