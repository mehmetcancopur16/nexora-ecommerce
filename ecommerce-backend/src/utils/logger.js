const winston = require("winston");
const path = require("path");
const fs = require("fs");

const isProduction = process.env.NODE_ENV === "production";

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} ${level}: ${message}${rest}`;
  })
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

function buildTransports() {
  if (!isProduction) {
    return [
      new winston.transports.Console({
        format: devFormat,
      }),
    ];
  }

  const logDir = path.join(__dirname, "..", "..", "logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  return [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      format: prodFormat,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      format: prodFormat,
    }),
  ];
}

const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  transports: buildTransports(),
  exitOnError: false,
});

module.exports = logger;
