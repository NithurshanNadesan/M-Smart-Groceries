const express = require("express");
const router = express.Router();
const Product = require("../models/products");

// 🔢 Get Product Count
router.get("/count", async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error counting products", error });
    }
});

// ✅ Create a Product
router.post("/", async (req, res) => {
    try {
        const { name, categoryFk, brandFk, description, image } = req.body;
        const product = new Product({ name, categoryFk, brandFk, description, image });
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating product", error });
    }
});

// ✅ Get All Products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().populate("categoryFk brandFk", "categoryName brandName");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching products", error });
    }
});

// ✅ Get a Single Product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("categoryFk brandFk", "categoryName brandName");
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching product", error });
    }
});


// ✅ Update Product by ID
router.put("/:id", async (req, res) => {
    try {
        const { name, categoryFk, brandFk, description, image } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            { name, categoryFk, brandFk, description, image }, 
            { new: true }
        ).populate("categoryFk brandFk", "categoryName brandName");
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating product", error });
    }
});

// ✅ Delete Product by ID
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting product", error });
    }
});

module.exports = router;
