const mongoose = require("mongoose");

const ProductVariantSchema = new mongoose.Schema({
    productFk: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    size: { type: String, required: true },
    newPrice: { type: Number, required: true },
    oldPrice: { type: Number, required: true },
    stock: { type: Number, required: true }
}, { collection: "productVariants" });

module.exports = mongoose.model("ProductVariant", ProductVariantSchema);





