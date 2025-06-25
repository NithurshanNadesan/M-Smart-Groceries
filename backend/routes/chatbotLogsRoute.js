const express = require("express");
const router = express.Router();
const ChatbotLog = require("../models/chatbotLogs");

// ✅ Create a chatbot log
router.post("/", async (req, res) => {
    try {
        const { customerFk, query } = req.body;
        const chatbotLog = new ChatbotLog({ customerFk, query });
        await chatbotLog.save();
        res.status(201).json({ success: true, chatbotLog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating chatbot log", error });
    }
});

// ✅ Get all chatbot logs
router.get("/", async (req, res) => {
    try {
        const chatbotLogs = await ChatbotLog.find().populate("customerFk", "name email");
        res.status(200).json({ success: true, chatbotLogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching chatbot logs", error });
    }
});

// ✅ Get chatbot logs by customer ID
router.get("/:customerFk", async (req, res) => {
    try {
        const chatbotLogs = await ChatbotLog.find({ customerFk: req.params.customerFk }).populate("customerFk", "name email");
        res.status(200).json({ success: true, chatbotLogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching chatbot logs", error });
    }
});

// ✅ Delete a chatbot log by ID
router.delete("/:id", async (req, res) => {
    try {
        await ChatbotLog.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Chatbot log deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting chatbot log", error });
    }
});

module.exports = router;
