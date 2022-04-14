const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    brand: { type: String, require: true },
    model: { type: String, require: true },
    type: { type: String },
    price: { type:Number },
    category: { 
        type: Schema.Types.ObjectId,
        ref: "Category" 
    }
});

module.exports = mongoose.model("Product", ProductSchema);