const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const status = require("http-status");
const apiRouter = require("../app/routes/v1/api");
const config = require("../app/config/app");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = () => {
  const app = express();
  app.use(compression());
  app.use(cors());
  app.use(express.json());
  app.use(limiter);
  app.use(helmet());
  app.use(config.API_PREFIX, apiRouter);
  return app;
};
