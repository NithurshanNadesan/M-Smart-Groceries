const express = require("express");
const Discount = require("../models/discount");

const router = express.Router();

// ✅ Create a new discount
router.post("/", async (req, res) => {
    try {
        const { name, percentage } = req.body;

        // Check if discount already exists
        const existingDiscount = await Discount.findOne({ name });
        if (existingDiscount) {
            return res.status(400).json({ success: false, message: "Discount already exists" });
        }

        const newDiscount = new Discount({ name, percentage });
        await newDiscount.save();

        res.status(201).json({ success: true, message: "Discount added successfully", discount: newDiscount });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error creating discount", error: err });
    }
});

// ✅ Get all discounts
router.get("/", async (req, res) => {
    try {
        const discounts = await Discount.find();
        res.status(200).json(discounts);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching discounts", error: err });
    }
});

// ✅ Get a single discount by ID
router.get("/:id", async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id);
        if (!discount) {
            return res.status(404).json({ success: false, message: "Discount not found" });
        }
        res.status(200).json(discount);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching discount", error: err });
    }
});

// ✅ Update a discount by ID
router.put("/:id", async (req, res) => {
    try {
        const { name, percentage } = req.body;
        const updatedDiscount = await Discount.findByIdAndUpdate(
            req.params.id,
            { name, percentage },
            { new: true }
        );

        if (!updatedDiscount) {
            return res.status(404).json({ success: false, message: "Discount not found" });
        }

        res.status(200).json({ success: true, message: "Discount updated successfully", discount: updatedDiscount });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating discount", error: err });
    }
});

// ✅ Delete a discount by ID
router.delete("/:id", async (req, res) => {
    try {
        await Discount.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Discount deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting discount", error: err });
    }
});

module.exports = router;
