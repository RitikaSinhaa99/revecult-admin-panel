import express from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const router = express.Router();
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' };

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

    const {name,email,password} =req.body;

    if(!validator.isEmail(email)){
      return res.status(400).json({message:"Invalid Email format"})
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        message: "Password must include at least one uppercase letter",
      });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        message: "Password must include at least one lowercase letter",
      });
    }
    if (!/\d/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must include at least one number" });
    }
    if (!/[@$!%*?&]/.test(password)) {
      return res.status(400).json({
        message: "Password must include at least one special character",
      });
    }

    const hashpassword =await bcrypt.hash(password,10);
    const user=await User.create({name,email,password:hashpassword});
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
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Check password
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, { expiresIn: '7d' });
    res.cookie('access_token', token, cookieOptions);

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      region: user.region,
      pincode: user.pincode,
    };

    return res.status(200).json({ message: 'login successful', token, user: safeUser });

    // 3. SUCCESS → return SAME exact user always
    // return res.json({
    //   success: true,
    //   user: {
    //     _id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     phone: user.phone,
    //     address: user.address,
    //     region: user.region,
    //     pincode: user.pincode
    //   }
    // });

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

export default router;
