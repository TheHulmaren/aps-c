const express = require("express");
const { upload } = require("../multer/multer");
const { addNewLens, addNewArticle, addNewSamplePhoto, isLoggedIn } = require("../middlewares/middleware");
const router = express.Router();

router.get("/lens/form", (req, res) => {
  res.render("lensform.ejs");
});

router.post("/lens", addNewLens, (req, res) => {
  res.status(200).send({ message: "Lens added" });
});

router.post("/article", addNewArticle, (req, res) => {
  res.send({ message: "Added new article" });
});

router.post(
  "/samplephoto",
  isLoggedIn,
  upload.single("uploaded_file"),
  addNewSamplePhoto,
  (req, res) => {
    res.send({ message: "Image uploaded successfully" });
  }
);

module.exports = router;
