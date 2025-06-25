const express = require("express");
const StockPurchase = require("../models/stockPurchase");
const Supplier = require("../models/supplier");
const Admin = require("../models/admin");

const router = express.Router();

// ✅ Create a new stock purchase
router.post("/", async (req, res) => {
    try {
        const { supplierFk, adminFk, date, status, totalAmount } = req.body;

        // Validate supplier and admin exist
        const supplier = await Supplier.findById(supplierFk);
        const admin = await Admin.findById(adminFk);
        if (!supplier || !admin) {
            return res.status(404).json({ success: false, message: "Supplier or Admin not found" });
        }

        const newStockPurchase = new StockPurchase({
            supplierFk,
            adminFk,
            date,
            status,
            totalAmount
        });

        await newStockPurchase.save();
        // 🔥 Populate supplierFk and adminFk before returning
        const populatedPurchase = await StockPurchase.findById(newStockPurchase._id)
            .populate("supplierFk")
            .populate("adminFk");
        res.status(201).send({ stockPurchase: populatedPurchase });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error creating stock purchase", error: err });
    }
});

// ✅ Get all stock purchases
router.get("/", async (req, res) => {
    try {
        const stockPurchases = await StockPurchase.find()
            .populate("supplierFk", "name email address") // Populate supplier details
            .populate("adminFk", "name email"); // Populate admin details

        res.status(200).json(stockPurchases);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching stock purchases", error: err });
    }
});

// ✅ Get a single stock purchase by ID
router.get("/:id", async (req, res) => {
    try {
        const stockPurchase = await StockPurchase.findById(req.params.id)
            .populate("supplierFk", "name email address")
            .populate("adminFk", "name email");

        if (!stockPurchase) {
            return res.status(404).json({ success: false, message: "Stock purchase not found" });
        }

        res.status(200).json(stockPurchase);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching stock purchase", error: err });
    }
});

// ✅ Update a stock purchase by ID
router.put("/:id", async (req, res) => {
    try {
        const { supplierFk, adminFk, date, status, totalAmount } = req.body;

        // Validate supplier and admin exist
        const supplier = await Supplier.findById(supplierFk);
        const admin = await Admin.findById(adminFk);
        if (!supplier || !admin) {
            return res.status(404).json({ success: false, message: "Supplier or Admin not found" });
        }

        const updatedStockPurchase = await StockPurchase.findByIdAndUpdate(
            req.params.id,
            { supplierFk, adminFk, date, status, totalAmount },
            { new: true }
        );

        if (!updatedStockPurchase) {
            return res.status(404).json({ success: false, message: "Stock purchase not found" });
        }

        // 🔥 Populate supplierFk and adminFk before returning
        const populatedPurchase = await StockPurchase.findById(updatedStockPurchase._id)
            .populate("supplierFk")
            .populate("adminFk");

        // ✅ Send only ONE response
        res.status(200).json({ 
            success: true, 
            message: "Stock purchase updated successfully", 
            stockPurchase: populatedPurchase 
        });
    } catch (err) {
        console.error("Error updating stock purchase:", err);
        res.status(500).json({ 
            success: false, 
            message: "Error updating stock purchase", 
            error: err.message 
        });
    }
});

// ✅ Delete a stock purchase by ID
router.delete("/:id", async (req, res) => {
    try {
        await StockPurchase.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Stock purchase deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting stock purchase", error: err });
    }
});

module.exports = router;
