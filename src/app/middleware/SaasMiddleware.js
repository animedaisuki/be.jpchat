const { Mongoose } = require("mongoose");
const config = require("../config/app");
let { dataConnectionPool } = require("../utils/dbContext");

exports.saas = async (req, res, next) => {
  if (!dataConnectionPool) {
    const dataConnectionMongoose = new Mongoose();
    await dataConnectionMongoose.connect(config.db);
    dataConnectionPool = dataConnectionMongoose;
    req.dbConnetion = dataConnectionPool;
    next();
  } else {
    req.dbConnetion = dataConnectionPool;
    next();
  }
};
