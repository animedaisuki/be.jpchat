const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const status = require("http-status");
const apiRouter = require("../app/routes/v1/api");
const config = require("../app/config/app");

module.exports = () => {
  const app = express();
  app.use(compression());
  app.use(cors());
  app.use(express.json());
  app.use(helmet());
  app.use(config.API_PREFIX, apiRouter);
  return app;
};
