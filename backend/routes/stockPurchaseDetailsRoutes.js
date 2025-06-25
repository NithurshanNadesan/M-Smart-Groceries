const express = require("express");
const StockPurchaseDetail = require("../models/stockPurchaseDetails");
const StockPurchase = require("../models/stockPurchase");
const ProductVariant = require("../models/productVariants");

const router = express.Router();

// ✅ Create a new stock purchase detail
router.post("/", async (req, res) => {
    try {
        const { stockPurchaseFk, productVariantFk, quantity, amount } = req.body;

        // Validate stock purchase and product variant exist
        const stockPurchase = await StockPurchase.findById(stockPurchaseFk);
        const productVariant = await ProductVariant.findById(productVariantFk);
        if (!stockPurchase || !productVariant) {
            return res.status(404).json({ success: false, message: "Stock Purchase or Product Variant not found" });
        }

        const newStockPurchaseDetail = new StockPurchaseDetail({
            stockPurchaseFk,
            productVariantFk,
            quantity,
            amount
        });

        await newStockPurchaseDetail.save();
        res.status(201).json({ success: true, message: "Stock purchase detail added successfully", stockPurchaseDetail: newStockPurchaseDetail });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error creating stock purchase detail", error: err });
    }
});

// ✅ Get all stock purchase details
router.get("/", async (req, res) => {
    try {
        const stockPurchaseDetails = await StockPurchaseDetail.find()
            .populate("stockPurchaseFk", "date status totalAmount")
            .populate("productVariantFk", "size price stock");

        res.status(200).json(stockPurchaseDetails);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching stock purchase details", error: err });
    }
});

// ✅ Get all stock purchase details for a specific stock purchase
router.get("/stock-purchase/:stockPurchaseFk", async (req, res) => {
    try {
        const stockPurchaseDetails = await StockPurchaseDetail.find({ stockPurchaseFk: req.params.stockPurchaseFk })  
        .populate({
            path: "productVariantFk",
            select: "size newPrice oldPrice stock",
            populate: {
                path: "productFk",
                select: "name"
            }
        });

        res.status(200).json(stockPurchaseDetails);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching stock purchase details", error: err });
    }
});

// ✅ Get a single stock purchase detail by ID
router.get("/:id", async (req, res) => {
    try {
        const stockPurchaseDetail = await StockPurchaseDetail.findById(req.params.id)
            .populate("stockPurchaseFk", "date status totalAmount")
            .populate("productVariantFk", "size price stock");

        if (!stockPurchaseDetail) {
            return res.status(404).json({ success: false, message: "Stock purchase detail not found" });
        }

        res.status(200).json(stockPurchaseDetail);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching stock purchase detail", error: err });
    }
});

// ✅ Update a stock purchase detail by ID
router.put("/:id", async (req, res) => {
    try {
        const { stockPurchaseFk, productVariantFk, quantity, amount } = req.body;

        // Validate stock purchase and product variant exist
        const stockPurchase = await StockPurchase.findById(stockPurchaseFk);
        const productVariant = await ProductVariant.findById(productVariantFk);
        if (!stockPurchase || !productVariant) {
            return res.status(404).json({ success: false, message: "Stock Purchase or Product Variant not found" });
        }

        const updatedStockPurchaseDetail = await StockPurchaseDetail.findByIdAndUpdate(
            req.params.id,
            { stockPurchaseFk, productVariantFk, quantity, amount },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Stock purchase detail updated successfully", stockPurchaseDetail: updatedStockPurchaseDetail });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating stock purchase detail", error: err });
    }
});

// ✅ Delete a stock purchase detail by ID
router.delete("/:id", async (req, res) => {
    try {
        await StockPurchaseDetail.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Stock purchase detail deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting stock purchase detail", error: err });
    }
});

module.exports = router;
