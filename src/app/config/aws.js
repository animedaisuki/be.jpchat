const dotenv = require("dotenv");
process.env.NODE_ENV = process.env.NODE_ENV || "amahane";
dotenv.config();

module.exports = {
  awsRegion: process.env.AWS_REGION,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
};
