const express = require("express");
const CartDetails = require("../models/cartDetails");

const router = express.Router();

// ✅ Add product to cart
router.post("/", async (req, res) => {
    try {
        const { cartFk, productVariantFk, quantity, price } = req.body;
        const cartItem = new CartDetails({ cartFk, productVariantFk, quantity, price });
        await cartItem.save();

        res.status(201).json({ success: true, cartItem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding to cart", error });
    }
});

// ✅ Get all items in a cart
router.get("/:cartFk", async (req, res) => {
    try {
        const cartItems = await CartDetails.find({ cartFk: req.params.cartFk })
            .populate("productVariantFk", "size price");

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching cart items", error });
    }
});

// ✅ Update product quantity in cart
router.put("/:id", async (req, res) => {
    try {
        const { quantity, total } = req.body;
        const cartItem = await CartDetails.findByIdAndUpdate(req.params.id, { quantity, total }, { new: true });

        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        res.status(200).json({ success: true, cartItem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating cart item", error });
    }
});

// ✅ Remove an item from cart
router.delete("/:id", async (req, res) => {
    try {
        const cartItem = await CartDetails.findByIdAndDelete(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }
        res.status(200).json({ success: true, message: "Cart item removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing cart item", error });
    }
});

// ✅ Clear all items from a cart
router.delete("/clear/:cartFk", async (req, res) => {
    try {
        await CartDetails.deleteMany({ cartFk: req.params.cartFk });
        res.status(200).json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error clearing cart", error });
    }
});

module.exports = router;
