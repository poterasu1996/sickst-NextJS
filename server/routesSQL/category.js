// category route
const express = require("express");
const router = express.Router();
const { pool } = require('../config/databasepg');

// get all categories
router.get("/", async(req, res) => {
  try {
    const allCategories = await pool.query("SELECT * FROM category");
    res.json(allCategories.rows);
  } catch (error) {
    console.error(error.message);
  }
})

// get a category
router.get("/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const category = await pool.query("SELECT * FROM category WHERE id = $1", [id]);
    res.json(category.rows);
  } catch (error) {
    console.error(error.message); 
  }
})

// insert a category
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await pool.query(
      "INSERT INTO category (name) VALUES($1) RETURNING *",
      [name]
    );

    res.json(newCategory);
  } catch (error) {
    console.error(error.message);
  }
});

// update a category
router.patch("/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updateCategory = await pool.query(`UPDATE "category" SET name = $1 WHERE id = $2`, [name, id]);

    res.json("Category updated.");
  } catch (error) {
    console.error(error.message);
  }
});

// delete a category
router.delete("/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const deleteCategory = await pool.query("DELETE FROM category WHERE id = $1", [id]);

    res.json("Category deleted");
  } catch (error) {
    console.error(error.message);
  }
})


module.exports = router;