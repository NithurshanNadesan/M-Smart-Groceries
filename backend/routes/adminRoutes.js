const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const router = express.Router();
require('dotenv').config();

// ✅ Create Admin
router.post("/", async (req, res) => {
    try {
        const { name, username, password, email, mobileNo } = req.body;
        const admin = new Admin({ name, username, password, email, mobileNo });
        await admin.save();
        res.status(201).json({ success: true, admin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating admin", error });
    }
});

// ✅ Get All Admins
router.get("/", async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching admins", error });
    }
});

// ✅ Get Single Admin by ID
router.get("/:id", async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching admin", error });
    }
});

// ✅ Update Admin by ID
router.put("/:id", async (req, res) => {
    try {
        const { name, username, password, email, mobileNo } = req.body;
        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { name, username, password, email, mobileNo },
            { new: true }
        );
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.status(200).json({ success: true, admin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating admin", error });
    }
});

// ✅ Delete Admin by ID
router.delete("/:id", async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.status(200).json({ success: true, message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting admin", error });
    }
});

// ✅ Admin Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.SECRET_KEY, // Use the environment variable
            { expiresIn: "1h" }
        );

        // Send response with token
        res.json({ 
            success: true, 
            token, 
            adminId: admin._id, // 🟢 Include this
            adminName: admin.name // (Optional, helpful for showing admin name)
          });
          
    } catch (error) {
        res.status(500).json({ success: false, message: "Error during login", error });
    }
});


module.exports = router;
