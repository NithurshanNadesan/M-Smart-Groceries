const mongoose = require("mongoose");

const StockPurchaseSchema = new mongoose.Schema({
    supplierFk: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    adminFk: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    date: { type: Date, required: true },
    status: { type: String, required: true },
    totalAmount: { type: Number, required: true }
}, { collection: "stockPurchase" });

module.exports = mongoose.model("StockPurchase", StockPurchaseSchema);
