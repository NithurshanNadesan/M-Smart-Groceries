const express = require("express");
const { getStockByCategory } = require("../controllers/stockController");

const router = express.Router();

router.get("/stock-by-category", getStockByCategory);

module.exports = router;
