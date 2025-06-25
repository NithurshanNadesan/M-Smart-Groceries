const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNo: { type: String, required: true },
});

// Hash the password before saving the admin to the database
AdminSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();  // Only hash if password is modified

    const salt = await bcrypt.genSalt(10);  // Generate salt
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password
    next();
});


module.exports = mongoose.model("Admin", AdminSchema);
