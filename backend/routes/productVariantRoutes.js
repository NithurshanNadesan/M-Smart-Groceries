const express = require("express");
const router = express.Router();
const ProductVariant = require("../models/productVariants");

// ✅ Create a Product Variant
router.post("/", async (req, res) => {
    try {
        const { productFk, size, newPrice, oldPrice, stock } = req.body;
        const variant = new ProductVariant({ productFk, size, newPrice, oldPrice, stock });
        await variant.save();
        res.status(201).json({ success: true, variant });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating product variant", error });
    }
});

// ✅ Get All Product Variants
router.get("/", async (req, res) => {
    try {
        const variants = await ProductVariant.find().populate("productFk", "name");
        res.status(200).json(variants);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching product variants", error });
    }
});

// ✅ Get All Variants for a Specific Product
router.get("/product/:productFk", async (req, res) => {
    try {
        const variants = await ProductVariant.find({ productFk: req.params.productFk });
        res.status(200).json(variants);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching product variants", error });
    }
});

// ✅ Get a Single Product Variant by ID
router.get("/:id", async (req, res) => {
    try {
        const variant = await ProductVariant.findById(req.params.id);
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }
        res.status(200).json(variant);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching product variant", error });
    }
});


// ✅ Update a Product Variant
router.put("/:id", async (req, res) => {
    try {
        const { size, newPrice, oldPrice, stock } = req.body;
        const variant = await ProductVariant.findByIdAndUpdate(
            req.params.id, 
            { size, newPrice, oldPrice, stock }, 
            { new: true }
        );
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }
        res.status(200).json({ success: true, variant });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating product variant", error });
    }
});

// ✅ Update Product Variant Stock (Add this to your existing routes)
router.put("/update-stock/:id", async (req, res) => {
    try {
        const { quantity } = req.body;
        const variant = await ProductVariant.findById(req.params.id);
        
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }

        // Check if stock would go negative
        if (variant.stock + quantity < 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Insufficient stock available" 
            });
        }

        variant.stock += quantity; // Can be positive or negative
        await variant.save();
        
        res.status(200).json({ 
            success: true, 
            variant,
            message: "Stock updated successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error updating product variant stock", 
            error 
        });
    }
});

// ✅ Delete a Product Variant
router.delete("/:id", async (req, res) => {
    try {
        const variant = await ProductVariant.findByIdAndDelete(req.params.id);
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }
        res.status(200).json({ success: true, message: "Variant deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting product variant", error });
    }
});

module.exports = router;
