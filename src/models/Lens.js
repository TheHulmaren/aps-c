const { parseXML } = require("jquery");
const { ObjectId } = require("mongodb");
const { getDb } = require("../db/db");

function Lens() {}

Lens.prototype.getLensByLid = function (strLid) {
  var lid = ObjectId(strLid);

  return new Promise((resolve, reject) => {
    getDb()
      .collection("lens")
      .findOne({ _id: lid }, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
  });
};

Lens.prototype.find = function (query, sort, skip, limit) {
  var query = query ?? {};
  var sort = sort ?? { _id: 1 };
  var skip = skip ?? 0;
  var limit = limit ?? 0;

  return new Promise((resolve, reject) => {
    getDb()
      .collection("lens")
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray((err, result) => {
        if (err) reject(err);

        resolve(result);
      });
  });
};

Lens.prototype.updateLensById = function (strLid, data) {
  var lid = ObjectId(strLid)
  return new Promise((resolve, reject) => {
    getDb()
      .collection("lens")
      .updateOne({ _id: lid }, { $set: data }, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
  });
};

Lens.prototype.addLens = function (data) {
  return new Promise((resolve, reject) => {
    getDb()
      .collection("lens")
      .insertOne(data, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
  });
};

module.exports = Lens;
