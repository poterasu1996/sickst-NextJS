const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("../models/Category");

router.route("/categories")
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
    });

module.exports = router;
