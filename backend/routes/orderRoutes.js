const express = require("express");
const Order = require("../models/orders");
const router = express.Router();
const nodemailer = require("nodemailer");
const Discount = require("../models/discount"); // import discount model
const Customer = require("../models/customers");
const orderTemplate = require("../emailTemplates/orderConfirmation");


// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

// ✅ Create a new order with email confirmation
router.post("/", async (req, res) => {
    try {
        const { customerFk, total, discountFk, paymentMethod } = req.body;

        // Calculate net amount
        let netAmount = total;
        if (discountFk) {
            const discount = await Discount.findById(discountFk);
            if (discount && discount.percentage) {
                netAmount = parseFloat((total - (total * discount.percentage / 100)).toFixed(2));
            }
        }

        // Create order
        const order = new Order({
            customerFk,
            total,
            discountFk,
            netAmount,
            paymentMethod
        });

        await order.save();

        // Get customer details for email
        const customer = await Customer.findById(customerFk);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customer.email,
            subject: `Order Confirmation #${order._id}`,
            html: orderTemplate(order, customer)
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ 
            success: true, 
            order,
            message: "Order created and confirmation email sent"
        });

    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error creating order", 
            error: error.message 
        });
    }
});

// ✅ Get all orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("customerFk", "name email")
            .populate("discountFk", "name percentage"); // ✅ Populate discount details

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching orders", error });
    }
});


// ✅ Get orders by customer
router.get("/customer/:customerFk", async (req, res) => {
    try {
        const orders = await Order.find({ customerFk: req.params.customerFk });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching orders", error });
    }
});

// ✅ Update order status
// Add this to your PUT /:id route
router.put("/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        ).populate('customerFk', 'email name')
         .populate('discountFk', 'name percentage');

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Send email if status changed to "Shipped"
        if (status === "Shipped") {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: order.customerFk.email,
                subject: `Your Order #${order._id} Has Shipped!`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #4CAF50;">Your Order is on the Way!</h1>
                        <p>Dear ${order.customerFk.name},</p>
                        <p>We're excited to let you know that your order <strong>#${order._id}</strong> has been shipped.</p>
                        
                        <h2 style="color: #333;">Shipping Details</h2>
                        <p>Expected delivery: Within 3-5 business days</p>
                        
                        <h2 style="color: #333;">Order Summary</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;">Order Number:</td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${order._id}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;">Total Amount:</td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Rs.${order.total.toFixed(2)}</td>
                            </tr>
                            ${order.discountFk ? `
                                <tr>
                                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Discount:</td>
                                    <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; color: #4CAF50;">
                                        - Rs.${(order.total - order.netAmount).toFixed(2)}
                                    </td>
                                </tr>
                            ` : ''}
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;">Net Amount:</td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Rs.${order.netAmount.toFixed(2)}</td>
                            </tr>
                        </table>
                        
                        <p style="margin-top: 20px;">You can track your order using our tracking system.</p>
                        
                        <p>Thank you for shopping with us!<br>M Smart Groceries Team</p>
                    </div>
                `
            };
            
            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating order", error });
    }
});

// ✅ Delete an order
router.delete("/:id", async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting order", error });
    }
});

module.exports = router;
