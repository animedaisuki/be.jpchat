const dotenv = require("dotenv");
dotenv.config();

const DEFAULT_MONGODB_URL = "mongodb://admin:123456@localhost:27017/7";

module.exports = {
  port: process.env.PORT || 8080,
  db: process.env.MONGODB_URL || DEFAULT_MONGODB_URL,
  API_PREFIX: "/api/v1",
  secrete: process.env.SECTRETE,
  hCaptchaSecret: process.env.HCAPTCHA_SECRET || "123456",
  jwtSecrete: process.env.JWT_ACCESS_SECRET || "123456",
  open_ai_key: process.env.OPENAI_API_KEY || "",
  subscription_key: process.env.SUBSCRIPTION_KEY || "",
  service_region: process.env.SERVICE_REGION || "",
  aiUserId: process.env.AI_USER_ID || "68f334a6d5ff0d35a55ae779",
};
