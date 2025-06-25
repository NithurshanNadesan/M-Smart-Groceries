const express = require("express");
const Supplier = require("../models/supplier");
const router = express.Router();

// Create a new supplier
router.post("/", async (req, res) => {
    try {
        const { name, email, address } = req.body;
        const newSupplier = new Supplier({ name, email, address });
        await newSupplier.save();
        res.status(201).json({ success: true, message: "Supplier added successfully", supplier: newSupplier });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error creating supplier", error: err });
    }
});

// Get all suppliers
router.get("/", async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching suppliers", error: err });
    }
});

// Get a supplier by ID
router.get("/:id", async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }
        res.status(200).json(supplier);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching supplier", error: err });
    }
});

// Update a supplier by ID
router.put("/:id", async (req, res) => {
    try {
        const { name, email, address } = req.body;
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { name, email, address },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Supplier updated successfully", supplier: updatedSupplier });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating supplier", error: err });
    }
});

// Delete a supplier by ID
router.delete("/:id", async (req, res) => {
    try {
        await Supplier.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Supplier deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting supplier", error: err });
    }
});

module.exports = router;
