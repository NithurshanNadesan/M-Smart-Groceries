const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true }
});

module.exports = mongoose.model("Category", CategorySchema);
