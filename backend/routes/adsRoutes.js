const express = require("express");
const router = express.Router();
const Ads = require("../models/ads");

// ✅ Create Ad
router.post("/", async (req, res) => {
    try {
        const { title, image, adminFk } = req.body;
        const ad = new Ads({ title, image, adminFk });
        await ad.save();
        res.status(201).json({ success: true, ad });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating ad", error });
    }
});

// ✅ Get All Ads
router.get("/", async (req, res) => {
    try {
        const ads = await Ads.find().populate("adminFk", "name");
        res.status(200).json(ads);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching ads", error });
    }
});

// ✅ Get Single Ad by ID
router.get("/:id", async (req, res) => {
    try {
        const ad = await Ads.findById(req.params.id).populate("adminFk", "name");
        if (!ad) {
            return res.status(404).json({ success: false, message: "Ad not found" });
        }
        res.status(200).json(ad);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching ad", error });
    }
});

// ✅ Update Ad by ID
router.put("/:id", async (req, res) => {
    try {
        const { title, image, adminFk } = req.body;
        const ad = await Ads.findByIdAndUpdate(
            req.params.id,
            { title, image, adminFk },
            { new: true }
        );
        if (!ad) {
            return res.status(404).json({ success: false, message: "Ad not found" });
        }
        res.status(200).json({ success: true, ad });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating ad", error });
    }
});

// ✅ Delete Ad by ID
router.delete("/:id", async (req, res) => {
    try {
        const ad = await Ads.findByIdAndDelete(req.params.id);
        if (!ad) {
            return res.status(404).json({ success: false, message: "Ad not found" });
        }
        res.status(200).json({ success: true, message: "Ad deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting ad", error });
    }
});

module.exports = router;
