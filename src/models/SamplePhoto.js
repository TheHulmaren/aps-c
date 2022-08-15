const { ObjectId } = require("mongodb");
const { uploadFileStream } = require("../bucket/bucket");
const { getDb } = require("../db/db");

function SamplePhoto() {}

SamplePhoto.prototype.addSamplePhotoInfo = function (data) {
  return new Promise((resolve, reject) => {
    getDb()
      .collection("samplephoto")
      .insertOne(data, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
  });
};

SamplePhoto.prototype.uploadSamplePhoto = function (fileStream) {
  var folder = "samplephotos";
  var name = "samplephoto-" + new Date().toISOString() + ".jpeg";

  var key = folder + "/" + name;

  return new Promise((resolve, reject) => {
    uploadFileStream(fileStream, key)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

SamplePhoto.prototype.findSamplePhotosByLens = function (strLid) {
  var lid = ObjectId(strLid);

  return new Promise((resolve, reject) => {
    getDb()
      .collection("samplephoto")
      .find({ lens: lid })
      .toArray((err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
  });
};

module.exports = SamplePhoto;
