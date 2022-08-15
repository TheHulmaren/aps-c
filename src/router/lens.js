const express = require("express");
const {
  articlePagination,
  sideBarSamplePhotos,
  getLensDetail,
  getLensSamplePhotos,
  samplePhotoSlide,
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

router.get("/:id/samplephotos", getLensSamplePhotos, (req, res) => {
  res.render("samplephotos.ejs");
});

router.get("/:id/samplephoto/:pid", samplePhotoSlide, (req, res) => {
  res.render("sample.ejs");
});

module.exports = router;
