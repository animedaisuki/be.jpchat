const mongoose = require("mongoose");
const config = require("../app/config/app");

module.exports = async function () {
  const connection = await mongoose
    .connect(config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });
  return connection.connection.db;
};
