const mongoose = require("mongoose");

const StockPurchaseDetailSchema = new mongoose.Schema({
    stockPurchaseFk: { type: mongoose.Schema.Types.ObjectId, ref: "StockPurchase", required: true },
    productVariantFk: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true }
}, { collection: "stockPurchaseDetails" });

module.exports = mongoose.model("StockPurchaseDetail", StockPurchaseDetailSchema);
