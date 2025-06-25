const mongoose = require("mongoose");

const CartDetailSchema = new mongoose.Schema({
    cartFk: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
    productVariantFk: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
}, { collection: "cartDetails" });

module.exports = mongoose.model("CartDetail", CartDetailSchema);
