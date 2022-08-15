const { ObjectId } = require("mongodb");
const { uploadFileStream, getPresignedUrl } = require("../lib/bucket/bucket");
const { getDb } = require("../lib/db/db");

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

SamplePhoto.prototype.getSamplePhotoById = function (strPid) {
  return new Promise((resolve, reject) => {
    getDb()
      .collection("samplephoto")
      .findOne({ _id: ObjectId(strPid) }, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
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

SamplePhoto.prototype.findNearbyPhotosById = function (strPid, strLid, range) {
  var pid = ObjectId(strPid);
  var lid = ObjectId(strLid);

  return new Promise((resolve, reject) => {
    getDb()
      .collection("samplephoto")
      .find({ _id: { $gte: pid }, lens: lid })
      .sort({ _id: 1 })
      .limit(range + 1)
      .toArray((err, result) => {
        if (err) {
          reject(err);
          return;
        }

        var backPart = result;

        getDb()
          .collection("samplephoto")
          .find({ _id: { $lt: pid }, lens: lid })
          .sort({ _id: -1 })
          .limit(range)
          .sort({ _id: 1 })
          .toArray((err, result) => {
            if (err) {
              reject(err);
              return;
            }

            var frontPart = result;

            var photos = [...frontPart, ...backPart];

            resolve(photos);
          });
      });
  });
};

SamplePhoto.prototype.getPresignedUrls = function (samplephotos) {
  var result = [];
  samplephotos.forEach((e) => {
    var url = getPresignedUrl(
      e.Key,
      parseInt(process.env.AWS_PRESIGNED_URL_EXPIRATION)
    );
    result.push({ ...e, url: url });
  });

  return result;
};

module.exports = SamplePhoto;
