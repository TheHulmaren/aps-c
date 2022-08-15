// Set up the connection to the MongoDB
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const connectionString = process.env.MONGODB_URI;

var db;

function connect(cb) {
  MongoClient.connect(connectionString, function (err, client) {
    if (err) cb(err, null);

    db = client.db("apsc");
    console.log("MongoDB connected.");
    
    cb(null, db);
  });
}

function getDb() {
  return db;
}

var ObjectId = require("mongodb").ObjectId;

module.exports = { ObjectId, connect, getDb };
