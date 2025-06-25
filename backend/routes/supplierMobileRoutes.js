const express = require("express");
const SupplierMobile = require("../models/SupplierMobile");
const Supplier = require("../models/supplier");
const router = express.Router();

// Create a new supplier mobile
router.post("/", async (req, res) => {
    try {
        const { supplierFk, mobileNumber } = req.body;

        // Check if the supplier exists
        const supplier = await Supplier.findById(supplierFk);
        if (!supplier) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }

        const newSupplierMobile = new SupplierMobile({ supplierFk, mobileNumber });
        await newSupplierMobile.save();

        res.status(201).json({ success: true, message: "Supplier mobile added successfully", supplierMobile: newSupplierMobile });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error creating supplier mobile", error: err });
    }
});

// Get all supplier mobiles with supplier details
router.get("/", async (req, res) => {
    try {
        // Populate the supplier details (including supplier name) when fetching supplier mobiles
        const supplierMobiles = await SupplierMobile.find().populate("supplierFk", "name");
        res.status(200).json(supplierMobiles);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching supplier mobiles", error: err });
    }
});

// Get a specific supplier mobile by ID with supplier details
router.get("/:id", async (req, res) => {
    try {
        // Populate the supplier details (including supplier name) when fetching a single supplier mobile
        const supplierMobile = await SupplierMobile.findById(req.params.id).populate("supplierFk", "name");
        if (!supplierMobile) {
            return res.status(404).json({ success: false, message: "Supplier mobile not found" });
        }
        res.status(200).json(supplierMobile);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching supplier mobile", error: err });
    }
});


// Update a supplier mobile by ID
router.put("/:id", async (req, res) => {
    try {
        const { supplierFk, mobileNumber } = req.body;

        // Check if the supplier exists
        const supplier = await Supplier.findById(supplierFk);
        if (!supplier) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }

        const updatedSupplierMobile = await SupplierMobile.findByIdAndUpdate(
            req.params.id,
            { supplierFk, mobileNumber },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Supplier mobile updated successfully", supplierMobile: updatedSupplierMobile });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating supplier mobile", error: err });
    }
});

// Delete a supplier mobile by ID
router.delete("/:id", async (req, res) => {
    try {
        await SupplierMobile.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Supplier mobile deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting supplier mobile", error: err });
    }
});

module.exports = router;
