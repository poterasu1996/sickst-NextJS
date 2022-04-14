const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Product = require("../models/Product");

app.route("/api/products")
    .get((req, res) => {
        Product.find((err, products) => {
            if (!err) {
                res.send(products);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        const newProduct = new Product({
            brand: req.body.brand,
            model: req.body.model,
            type: req.body.type,
            price: req.body.price,
            category: req.body.category
        });

        newProduct.save();
    })
    .put()
    .delete();
