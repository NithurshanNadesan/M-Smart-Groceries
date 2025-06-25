const express = require("express");
const router = express.Router();

const Order = require("../models/orders"); // update path if needed
const OrderDetail = require("../models/orderDetails");
const ProductVariant = require("../models/productVariants");
const Product = require("../models/products");
const Category = require("../models/categories");
const Customer = require("../models/customers");

// GET /api/sales-details
router.get("/sales-details", async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ["Shipped", "Complete"] },
    }).populate("customerFk");

    const sales = orders.map((order) => ({
      orderId: order._id,
      customer: order.customerFk?.name || "Unknown",
      date: order.orderDate,
      amount: order.netAmount,
    }));

    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sales-by-category
router.get("/sales-by-category", async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ["Shipped", "Complete"] },
    });

    const orderIds = orders.map((o) => o._id);
    const orderDetails = await OrderDetail.find({
      orderFk: { $in: orderIds },
    }).populate({
      path: "productVariantFk",
      populate: {
        path: "productFk",
        populate: {
          path: "categoryFk",
        },
      },
    });

    const categoryMap = {};

    orderDetails.forEach((detail) => {
      const category =
        detail.productVariantFk?.productFk?.categoryFk?.categoryName || "Unknown";
      const amount =
        (detail.productVariantFk?.newPrice || 0) * detail.quantity;

      if (categoryMap[category]) {
        categoryMap[category] += amount;
      } else {
        categoryMap[category] = amount;
      }
    });

    const salesByCategory = Object.entries(categoryMap).map(
      ([category, amount], index) => ({
        id: index + 1,
        category,
        amount,
      })
    );

    res.json(salesByCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sales-history
router.get("/sales-history", async (req, res) => {
    try {
      const orders = await Order.find({
        status: { $in: ["Shipped", "Complete"] },
      });
  
      const orderIds = orders.map((o) => o._id);
  
      const orderDetails = await OrderDetail.find({
        orderFk: { $in: orderIds },
      }).populate({
        path: "productVariantFk",
        populate: {
          path: "productFk",
        },
      });
  
      const productSalesMap = {};
  
      orderDetails.forEach((detail) => {
        const product =
          detail.productVariantFk?.productFk?.name || "Unknown";
        const quantity = detail.quantity;
  
        if (productSalesMap[product]) {
          productSalesMap[product] += quantity;
        } else {
          productSalesMap[product] = quantity;
        }
      });
  
      const result = Object.entries(productSalesMap).map(
        ([product, quantitySold], index) => ({
          id: index + 1,
          product,
          quantitySold,
        })
      );
  
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
