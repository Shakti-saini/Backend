const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    size: { type: String, default: "Free" },
    price: { type: String},
    status: { type: String, enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

const OrderItem = mongoose.model("OrderItem", OrderSchema);
module.exports = OrderItem