const express = require("express");
const router = express.Router();
const Category = require("../models/categories");

// 🔢 Get Category Count
router.get("/count", async (req, res) => {
    try {
        const count = await Category.countDocuments();
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error counting products", error });
    }
});


// ✅ Create a Category
router.post("/", async (req, res) => {
    try {
        const { categoryName } = req.body;
        const category = new Category({ categoryName });
        await category.save();
        res.status(201).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating category", error });
    }
});

// ✅ Get All Categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching categories", error });
    }
});

// ✅ Get a Single Category by ID
router.get("/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching category", error });
    }
});

// ✅ Update Category by ID
router.put("/:id", async (req, res) => {
    try {
        const { categoryName } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id, 
            { categoryName }, 
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating category", error });
    }
});

// ✅ Delete Category by ID
router.delete("/:id", async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting category", error });
    }
});

module.exports = router;
