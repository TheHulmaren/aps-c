const S3 = require("aws-sdk/clients/s3");
const f3 = require("fs");
const { Readable } = require("stream");

// Load .env dependency
require("dotenv").config();

const s3 = new S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
});

function getPresignedUrl(key, expirationTime) {
  const url = s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: expirationTime,
  });

  return url;
}

function uploadFileStream(fileStream, key) {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileStream,
    Key: key,
  };

  return s3.upload(uploadParams).promise();
}

function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: process.env.AWS_BUCKET_NAME,
  };

  return s3.getObject(downloadParams).createReadStream();
}

module.exports = { getFileStream, uploadFileStream, getPresignedUrl };
