const express = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// GET ALL USERS
router.get("/users", adminAuth, async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// GET USER DETAILS
router.get("/users/:id", adminAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// GET ALL ORDERS
router.get("/orders", adminAuth, async (req, res) => {
  const orders = await Order.find({})
    .populate("userId")
    .populate("products.productId");
  res.json(orders);
});

// GET ORDERS BY USER
router.get("/orders/user/:id", adminAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.params.id })
    .populate("products.productId");
  res.json(orders);
});

// GET ALL PRODUCTS
router.get("/products", adminAuth, async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// CREATE PRODUCT
router.post("/products", adminAuth, async (req, res) => {
  try {
    const { name, price, description, category, image, stock } = req.body;
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      image,
      stock
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE PRODUCT
router.put("/products/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE PRODUCT
router.delete("/products/:id", adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
