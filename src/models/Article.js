const { ObjectId } = require("mongodb");
const { getDb } = require("../lib/db/db");

function Article() {}

Article.prototype.addArticle = function (data) {
  return new Promise((resolve, reject) => {
    getDb()
      .collection("article")
      .insertOne(data, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
  });
};
//main

module.exports = Article