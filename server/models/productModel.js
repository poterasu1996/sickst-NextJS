const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    brand: { 
        type: String, 
        require: [true, 'The brand is required'] 
    },
    model: { 
        type: String, 
        require: [true, 'Model is required'] 
    },
    type: { type: String },
    price: { type: Number },
    category: { 
        type: Schema.Types.ObjectId,
        ref: "Category" 
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;