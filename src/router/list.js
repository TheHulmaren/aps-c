const express = require("express");
const { queryLenses } = require("../middlewares/middleware");

const router = express.Router();

router.get("/lens", queryLenses, (req, res) => {
  res.status(200).render("lenses.ejs");
});

module.exports = router;
