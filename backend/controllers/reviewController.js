const Review = require("../models/Review");
const mongoose = require("mongoose");
const { recalculateRating } = require("./companyController");

// GET /api/reviews?companyId=&sortBy=&order=
exports.getReviews = async (req, res) => {
  try {
    const { companyId, sortBy = "createdAt", order = "desc", page = 1, limit = 10 } = req.query;

    if (!companyId) return res.status(400).json({ success: false, message: "companyId is required" });

    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Review.countDocuments({ company: companyId });

    const reviews = await Review.find({ company: companyId })
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Calculate average rating
    const aggResult = await Review.aggregate([
      { $match: { company: new mongoose.Types.ObjectId(companyId) } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, totalCount: { $sum: 1 } } },
    ]);

    const avgRating = aggResult[0]?.avgRating ? Math.round(aggResult[0].avgRating * 10) / 10 : 0;
    const totalCount = aggResult[0]?.totalCount || 0;

    res.json({
      success: true,
      data: reviews,
      averageRating: avgRating,
      totalReviews: totalCount,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { companyId, fullName, subject, reviewText, rating } = req.body;

    if (!companyId) return res.status(400).json({ success: false, message: "companyId is required" });

    const review = await Review.create({
      company: companyId,
      fullName,
      subject,
      reviewText,
      rating: parseInt(rating),
    });

    // Recalculate company average rating
    await recalculateRating(new mongoose.Types.ObjectId(companyId));

    res.status(201).json({ success: true, data: review, message: "Review posted successfully" });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/reviews/:id/like
exports.likeReview = async (req, res) => {
  try {
    const { userId } = req.body; // client-generated ID to prevent double-liking
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    if (userId && review.likedBy.includes(userId)) {
      // Unlike
      review.likedBy = review.likedBy.filter((id) => id !== userId);
      review.likes = Math.max(0, review.likes - 1);
      await review.save();
      return res.json({ success: true, data: review, action: "unliked" });
    }

    review.likes += 1;
    if (userId) review.likedBy.push(userId);
    await review.save();

    res.json({ success: true, data: review, action: "liked" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    await recalculateRating(review.company);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
