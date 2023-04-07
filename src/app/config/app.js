const dotenv = require("dotenv");
dotenv.config();

const DEFAULT_MONGODB_URL =
  "mongodb+srv://amahane:5BtW1cJOfM2LGc9m@testmogoldb.o1jloky.mongodb.net/amahane?retryWrites=true&w=majority";

module.exports = {
  port: process.env.PORT || 8080,
  db: process.env.MONGODB_URL || DEFAULT_MONGODB_URL,
  API_PREFIX: "/api/v1",
  secrete: process.env.SECTRETE,
  hCaptchaSecret: process.env.HCAPTCHA_SECRET || "123456",
  jwtSecrete: process.env.JWT_ACCESS_SECRET || "123456",
  open_ai_key: process.env.OPENAI_API_KEY || "",
};
