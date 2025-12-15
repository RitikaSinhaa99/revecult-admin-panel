import Review from "../models/reviewModel.js";

export const createReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { product, rating, comment = "" } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const review = await Review.create({ product, user: userId, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    const status = err.code === 11000 ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};

export const getApprovedReviewsForProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listPendingReviews = async (_req, res) => {
  try {
    const reviews = await Review.find({ approved: { $ne: true } }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listMyReviews = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const reviews = await Review.find({ user: userId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

