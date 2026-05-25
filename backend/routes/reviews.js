const express = require("express");
const router = express.Router();
const {
  getReviews,
  createReview,
  likeReview,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/", getReviews);
router.post("/", createReview);
router.post("/:id/like", likeReview);
router.delete("/:id", deleteReview);

module.exports = router;
