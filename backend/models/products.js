const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    categoryFk: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brandFk: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model("Product", ProductSchema);




