const express = require("express");
const router = express.Router();
const User = require("../models/user");

// -------------------- SIGNUP --------------------
router.post("/signup", async (req, res) => {
  try {
    // Check if email already exists
    const exists = await User.findOne({ email: req.body.email });

    if (exists) {
      return res.json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = new User(req.body);
    await user.save();

    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        region: user.region,
        pincode: user.pincode
      }
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});


// -------------------- LOGIN (CORRECT & FIXED) --------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Check password
    if (user.password !== password) {
      return res.json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 3. SUCCESS → return SAME exact user always
    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        region: user.region,
        pincode: user.pincode
      }
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server error" });
  }
});


// -------------------- GET USER BY ID --------------------
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.json({ success: false, message: "User not found" });

    return res.json({ success: true, user });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});


// -------------------- UPDATE USER --------------------
router.put("/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);

    return res.json({
      success: true,
      message: "Profile updated"
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

module.exports = router;
