// category route
const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.route("/api/categories")
  .get((req, res) => {
      Category.find((err, categories) => {
          if (!err) {
              res.send(categories);
          } else {
              res.send(err);
          }
      });
  })
  .post((req, res) => {
      const newCategory = new Category({
          name: req.body.name
      });

      newCategory.save((err) => {
          if (!err) {
              res.send("Category successfully added!");
          } else {
              res.send(err);
          }
      });
  })
  .delete((req, res) => {
    Category.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all categories!");
      } else {
        res.send(err);
      }
    })
  });

module.exports = router;