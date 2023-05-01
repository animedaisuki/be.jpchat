const { S3Client } = require("@aws-sdk/client-s3");
const awsConfig = require("../config/aws");

const s3Client = new S3Client({
  credentials: {
    accessKeyId: awsConfig.awsAccessKey,
    secretAccessKey: awsConfig.awsSecretKey,
  },
  region: awsConfig.awsRegion,
});

module.exports = s3Client;
