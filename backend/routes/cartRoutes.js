const express = require("express");
const router = express.Router();
const Cart = require("../models/carts");

// ✅ Create a new cart
router.post("/", async (req, res) => {
    try {
        const { customerFk, status, total } = req.body;
        const cart = new Cart({ customerFk, status, total });
        await cart.save();

        res.status(201).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating cart", error });
    }
});

// ✅ Get cart by customer ID
router.get("/:customerFk", async (req, res) => {
    try {
        const cart = await Cart.findOne({ customerFk: req.params.customerFk }).populate("customerFk", "name");
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching cart", error });
    }
});

// ✅ Update cart status
router.put("/:id", async (req, res) => {
    try {
        const { status, total} = req.body;
        const cart = await Cart.findByIdAndUpdate(req.params.id, { status, total }, { new: true });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }
        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating cart", error });
    }
});

// ✅ Delete a cart
router.delete("/:id", async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Cart deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting cart", error });
    }
});

module.exports = router;
