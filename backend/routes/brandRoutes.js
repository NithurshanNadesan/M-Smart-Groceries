const express = require("express");
const router = express.Router();
const Brand = require("../models/brands");

// ✅ Create a Brand
router.post("/", async (req, res) => {
    try {
        const { brandName } = req.body;
        const brand = new Brand({ brandName });
        await brand.save();
        res.status(201).json({ success: true, brand });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating brand", error });
    }
});

// ✅ Get All Brands
router.get("/", async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching brands", error });
    }
});

// ✅ Get a Single Brand by ID
router.get("/:id", async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ success: false, message: "Brand not found" });
        }
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching brand", error });
    }
});

// ✅ Update Brand by ID
router.put("/:id", async (req, res) => {
    try {
        const { brandName } = req.body;
        const brand = await Brand.findByIdAndUpdate(
            req.params.id, 
            { brandName }, 
            { new: true }
        );
        if (!brand) {
            return res.status(404).json({ success: false, message: "Brand not found" });
        }
        res.status(200).json({ success: true, brand });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating brand", error });
    }
});

// ✅ Delete Brand by ID
router.delete("/:id", async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) {
            return res.status(404).json({ success: false, message: "Brand not found" });
        }
        res.status(200).json({ success: true, message: "Brand deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting brand", error });
    }
});

module.exports = router;
