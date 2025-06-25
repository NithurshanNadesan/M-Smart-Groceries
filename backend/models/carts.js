const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    customerFk: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    status: { type: String, required: true },
    total: { type: Number, required: true }
});

module.exports = mongoose.model("Cart", CartSchema);
