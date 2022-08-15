const express = require("express");
const apiRouter = express.Router();

const addRouter = require("./add");
const authRouter = require("./auth");
const editRouter = require("./edit");
const lensRouter = require("./lens");
const listRouter = require("./list");

apiRouter.get("/", (req, res) => {
  res.render("index.ejs");
});

apiRouter
  .use("/add", addRouter)
  .use("/auth", authRouter)
  .use("/edit", editRouter)
  .use("/lens", lensRouter)
  .use("/list", listRouter);

module.exports = apiRouter;
