const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        phone_number: { type: String, default: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, default: true },
        zip_code: { type: String, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
