const express = require("express");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For authentication
const Customer = require("../models/customers");
require("dotenv").config();

const router = express.Router();

// 🔢 Get Customer Count
router.get("/count", async (req, res) => {
    try {
        const count = await Customer.countDocuments();
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error counting products", error });
    }
});

// ✅ Create Customer (Sign Up)
router.post("/signup", async (req, res) => {
    try {
        const { name, email, mobileNo, password, address } = req.body;

        // Check if email already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new customer
        const customer = new Customer({ name, email, mobileNo, password: hashedPassword, address });
        await customer.save();

        res.status(201).json({ success: true, customer });
    } catch (error) {
        console.error("Error Creating Customer:", error); // 👈 Log error to console
        res.status(500).json({ success: false, message: "Error creating customer", error });
    }
});

// ✅ Customer Login (Authentication)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find customer by email
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: customer._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ success: true, token, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error logging in", error });
    }
});

// ✅ Get All Customers
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching customers", error });
    }
});

// ✅ Get Single Customer by ID
router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching customer", error });
    }
});

// ✅ Update Customer
router.put("/:id", async (req, res) => {
    try {
        const { name, email, mobileNo, address } = req.body;

        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, email, mobileNo, address },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        res.status(200).json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating customer", error });
    }
});

// ✅ Delete Customer
router.delete("/:id", async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.status(200).json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting customer", error });
    }
});

module.exports = router;
