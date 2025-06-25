const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    customerFk: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending", required: true },
    total: { type: Number, required: true },
    discountFk: { type: mongoose.Schema.Types.ObjectId, ref: "Discount" },
    netAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true }
});

module.exports = mongoose.model("Order", OrderSchema);
