const express = require("express");
const router = express.Router();
const Tag = require("../models/tag");
const AuthenticationMiddleware = require("../extensions/authentication");

// GET /tags/
router.get("/", AuthenticationMiddleware, async (req, res, next) => {
  let tags = await Tag.find().sort([["name", "ascending"]]);
  res.render("tags/index", {
    title: "Tag List",
    dataset: tags,
    user: req.user,
  });
});

// GET /tags/add
router.get("/add", AuthenticationMiddleware, (req, res, next) => {
  res.render("tags/add", { title: "Add new tag", user: req.user });
});

// POST /tags/add
router.post("/add", AuthenticationMiddleware, async (req, res, next) => {
  let newTag = new Tag({
    name: req.body.name,
    code: req.body.code,
  });
  await newTag.save();
  res.redirect("/tags");
});

module.exports = router;
