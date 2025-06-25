const mongoose = require("mongoose");

const ChatbotLogSchema = new mongoose.Schema({
    customerFk: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    query: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now }
}, { collection: "chatbotLogs" });

module.exports = mongoose.model("ChatbotLog", ChatbotLogSchema);
