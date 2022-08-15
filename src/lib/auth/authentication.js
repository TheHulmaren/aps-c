const express = require("express");
const app = express();
const { ObjectId, getDb } = require("../db/db");

// Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

function setPassport() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "id",
        passwordField: "pw",
        session: true,
        passReqToCallback: false,
      },
      function (id, pw, done) {
        getDb()
          .collection("login")
          .findOne({ id: id }, function (err, result) {
            if (err) return done(err);
            
            if (!result) return done(null, false, { message: "ID not found." });
            if (pw == result.pw) {
              return done(null, result);
            } else {
              return done(null, false, { message: "Password not found." });
            }
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    getDb()
      .collection("login")
      .findOne({ id: id }, (err, result) => {
        done(err, result);
      });
  });

  console.log('Passport configuration set.')
}

function getPassport() {
  return passport;
}

module.exports = {getPassport, setPassport };
