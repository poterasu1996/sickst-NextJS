const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        require: [true, 'Subscription name is required'] 
    },
    stripeSubLink: { 
        type: String, 
        require: [true, 'Stripe product link is required'] 
    },
    price: { type: Number },
});

const Subscription = mongoose.model("Product", subscriptionSchema);

module.exports = Subscription