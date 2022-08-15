const { query } = require("express");
const express = require("express");
const app = express();

// Load .env dependency
require("dotenv").config();

const session = require("express-session");
var path = require('path');


const { setPassport, getPassport, isLoggedIn } = require("./src/lib/auth/authentication");
const { connect } = require("./src/lib/db/db");
const apiRouter = require("./src/router");

// Etc.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.static("./src/public"));
app.use(
  session({ secret: "secretcode", resave: true, saveUninitialized: false })
);

// Connect to MongoDB
connect((err, result) => {
  if (err) return console.log(err);

  setPassport();
  app.use(getPassport().initialize());
  app.use(getPassport().session());

  // Routing
  app.use('/', apiRouter)

  // Start listening
  app.listen(process.env.PORT, () =>
    console.log(`Listening to the port ${process.env.PORT}...`)
  );
});
