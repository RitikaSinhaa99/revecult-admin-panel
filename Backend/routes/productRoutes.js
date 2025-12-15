import express from 'express';
import Product from '../models/productModel.js';

const router = express.Router();

// GET /api/products?search=&category=&minPrice=&maxPrice=&page=&limit=&sort=
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 20, sort } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    const skip = (Number(page) - 1) * Number(limit);
    const query = Product.find(filter).skip(skip).limit(Number(limit));
    if (sort) query.sort(sort);

    const products = await query.exec();
    const total = await Product.countDocuments(filter);

    res.json({ total, page: Number(page), limit: Number(limit), products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
