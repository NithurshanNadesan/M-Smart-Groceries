const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Add this right after your CORS setup
app.use((req, res, next) => {
    next();
  });
  
// Add to your existing server setup
require('dotenv').config(); // Add at top of file

// Add this with your other route imports
const dialogflowRoutes = require("./routes/dialogflowRoutes");

// Add this right after your dialogflow routes setup
app.use("/dialogflow", dialogflowRoutes);

// Add this test endpoint:
app.get('/dialogflow/test', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Dialogflow endpoint is working',
    timestamp: new Date() 
  });
});

// Database Connectin With MongoDB
mongoose.connect("mongodb+srv://nithurshan6112:%40MSGcluster06112002@msmartgroceriescluster.xnpqqwg.mongodb.net/MSmartGroceriesDB");

// API Creation
app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

// Image Store Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb) =>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage});


// Creating Upload Endpoint for Image
app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (req,res) => {
    console.log("Received file:", req.file); // Debug log
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})


// Import Routes
const categoryRoutes = require("./routes/categoryRoutes"); // <-- Import Categories Routes
const brandRoutes = require("./routes/brandRoutes"); // <-- Import Brands Routes
const productRoutes = require("./routes/productRoutes"); // <-- Import Products Routes
const productVariantRoutes = require("./routes/productVariantRoutes"); // <-- Import Product Variants Routes
const adminRoutes = require("./routes/adminRoutes"); // <-- Import Admin Routes
const adsRoutes = require("./routes/adsRoutes"); // <-- Import Ads Routes
const customerRoutes = require("./routes/customerRoutes"); // <-- Import Customers Routes
const chatbotLogsRoute = require("./routes/chatbotLogsRoute"); // <-- Import Chatbot Logs Routes
const cartRoutes = require("./routes/cartRoutes"); // <-- Import Cart Routes
const cartDetailsRoutes = require("./routes/cartDetailsRoutes"); // <-- Import Cart Details Routes
const orderRoutes = require("./routes/orderRoutes");
const orderDetailsRoutes = require("./routes/orderDetailsRoutes");
const supplierRoutes = require("./routes/supplierRoutes"); // <-- Import Supplier Routes
const supplierMobileRoutes = require("./routes/supplierMobileRoutes"); // <-- Import Supplier Mobile Routes
const stockPurchaseRoutes = require("./routes/stockPurchaseRoutes"); // <-- Import Stock Purchase Routes
const stockPurchaseDetailRoutes = require("./routes/stockPurchaseDetailsRoutes"); // <-- Import Stock Purchase Details Routes
const discountRoutes = require("./routes/discountRoutes"); // <-- Import Discount Routes
const salesRoutes = require("./routes/salesRoutes");

const stockRoutes = require("./routes/stockRoutes");



// Use Routes
app.use("/categories", categoryRoutes); // <-- Categories Route
app.use("/brands", brandRoutes); // <-- Brands Route
app.use("/products", productRoutes); // <-- Products Route
app.use("/product-variants", productVariantRoutes); // <-- Product Variants Route
app.use("/admins", adminRoutes); // <-- Admin Route
app.use("/ads", adsRoutes); // <-- Ads Route
app.use("/customers", customerRoutes); // <-- Customers Route
app.use("/chatbot-logs", chatbotLogsRoute); // <-- Chatbot Logs Route
app.use("/cart", cartRoutes); // <-- Cart Route
app.use("/cart-details", cartDetailsRoutes); // <-- Cart Details Route
app.use("/orders", orderRoutes);
app.use("/order-details", orderDetailsRoutes);
app.use("/suppliers", supplierRoutes); // <-- Suppliers Route
app.use("/supplier-mobiles", supplierMobileRoutes); // <-- Supplier Mobile Route
app.use("/stock-purchase", stockPurchaseRoutes); // <-- Stock Purchase Route
app.use("/stock-purchase-details", stockPurchaseDetailRoutes); // <-- Stock Purchase Details Route
app.use("/discounts", discountRoutes); // <-- Discount Route

app.use("/sales", salesRoutes);
app.use("/sales", require("./routes/salesRoutes"));


app.use("/get", stockRoutes);



app.listen(port, (error)=>{
    if (!error) {
        console.log("Server Running on Port: " + port);
    }
    else {
        console.log("Error: " + error);
    }
})