/* eslint-disable prettier/prettier */
const express = require("express");
const categoryController = require("./../controllers/categoryController");

const router = express.Router();

// we can chain multiple middlewares, by adding our custom middleware before the controller
// ex: if we want to check the data is valid, before making a POST request
router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
