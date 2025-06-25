const mongoose = require("mongoose");

const OrderDetailSchema = new mongoose.Schema({
    orderFk: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    productVariantFk: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number }
}, { collection: "orderDetails" });

module.exports = mongoose.model("OrderDetail", OrderDetailSchema);
