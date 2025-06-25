const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    adminFk: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }
}, { collection: "ads" });

module.exports = mongoose.model("Ad", AdSchema);
