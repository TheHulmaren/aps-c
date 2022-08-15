const express = require("express");
const { getLensDetail, editLensInfo, getLensEditDetail } = require("../middlewares/middleware");
const router = express.Router();

router.get("/lens/:id", getLensEditDetail, (req, res) => {
  res.status(200).render("lensedit.ejs");
});

router.put("/lens", editLensInfo, (req, res) => {
  res.send({ message: "Updated lens successfully" });
});

module.exports = router;
