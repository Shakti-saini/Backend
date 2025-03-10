const mongoose = require("mongoose");

// Order Item Schema
const OrderItemSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    address_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Address", 
        required: true 
    },
    payment_status: { type: Boolean, required: false,default: false },
    total_price: { type: Number, required: true },
    shipping: { type: String, default: "Free" },
    quantity: { type: Number},

});

const Order = mongoose.model("Order", OrderItemSchema);

module.exports = Order