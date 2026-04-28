const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ✅ 1. REGISTER USER (CREATE)
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check existing user
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ msg: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ✅ 2. LOGIN USER (AUTH)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Create token
        const token = jwt.sign(
            { id: user._id },
            "secretkey",
            { expiresIn: "1h" }
        );

        res.json({ msg: "Login successful", token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ✅ 3. GET ALL USERS (READ)
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ✅ 4. UPDATE USER (UPDATE)
router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ✅ 5. DELETE USER (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;