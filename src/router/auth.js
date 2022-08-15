const express = require("express");
const { getPassport } = require("../lib/auth/authentication");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  getPassport().authenticate("local", {
    failureRedirect: "/fail",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router