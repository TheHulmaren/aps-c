const express = require("express");
const {
  articlePagination,
  sideBarSamplePhotos,
  getLensDetail,
} = require("../middlewares/middleware");
const Lens = require("../models/Lens");
const router = express.Router();

router.get(
  "/:id",
  sideBarSamplePhotos,
  articlePagination,
  getLensDetail,
  (req, res) => {
    res.render("lensdetail.ejs", {
      user: req.user,
    });
  }
);

module.exports = router;
