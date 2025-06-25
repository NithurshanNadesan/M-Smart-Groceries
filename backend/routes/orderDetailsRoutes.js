const express = require("express");
const OrderDetails = require("../models/orderDetails");

const router = express.Router();

const ProductVariant = require("../models/productVariants"); // Import this if not already

// ✅ Add product to order
router.post("/", async (req, res) => {
  try {
    const { orderFk, productVariantFk, quantity } = req.body;

    // Fetch productVariant to get newPrice
    const variant = await ProductVariant.findById(productVariantFk);
    if (!variant) {
      return res.status(404).json({ success: false, message: "Product variant not found" });
    }

    const price = variant.newPrice * quantity;

    const orderItem = new OrderDetails({ orderFk, productVariantFk, quantity, price });
    await orderItem.save();

    res.status(201).json({ success: true, orderItem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding to order", error });
  }
});


// ✅ Get all order items
router.get("/", async (req, res) => {
    try {
        const orderItems = await OrderDetails.find().populate("productVariantFk", "size price");
        res.status(200).json(orderItems);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching all order items", error });
    }
});

// ✅ Get all items in an order
router.get("/:orderFk", async (req, res) => {
    try {
      const orderItems = await OrderDetails.find({ orderFk: req.params.orderFk })
        .populate({
          path: "productVariantFk",
          select: "size newPrice productFk",
          populate: {
            path: "productFk",
            select: "name"
          }
        });
  
      res.status(200).json(orderItems);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching order items", error });
    }
});
  

// ✅ Update product quantity in order
router.put("/:id", async (req, res) => {
    try {
        const { productVariantFk, quantity, price } = req.body;
        const orderItem = await OrderDetails.findByIdAndUpdate(req.params.id, { productVariantFk, quantity, price }, { new: true });

        if (!orderItem) {
            return res.status(404).json({ success: false, message: "Order item not found" });
        }

        res.status(200).json({ success: true, orderItem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating order item", error });
    }
});

// ✅ Remove an item from order
router.delete("/:id", async (req, res) => {
    try {
        const orderItem = await OrderDetails.findByIdAndDelete(req.params.id);
        if (!orderItem) {
            return res.status(404).json({ success: false, message: "Order item not found" });
        }
        res.status(200).json({ success: true, message: "Order item removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing order item", error });
    }
});

// ✅ Clear all items from an order
router.delete("/clear/:orderFk", async (req, res) => {
    try {
        await OrderDetails.deleteMany({ orderFk: req.params.orderFk });
        res.status(200).json({ success: true, message: "Order cleared successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error clearing order", error });
    }
});

module.exports = router;
