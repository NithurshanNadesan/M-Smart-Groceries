const mongoose = require("mongoose");

const SupplierMobileSchema = new mongoose.Schema({
    supplierFk: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    mobileNumber: { type: String, required: true }
}, { collection: "supplierMobile" });

module.exports = mongoose.model("SupplierMobile", SupplierMobileSchema);
