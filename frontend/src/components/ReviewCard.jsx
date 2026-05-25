import { useState } from "react";
import { likeReview, deleteReview } from "../utils/api";
import { StarDisplay } from "./StarRating";
import toast from "react-hot-toast";
import "./ReviewCard.css";

const getUserId = () => {
  let id = localStorage.getItem("zoronal_uid");
  if (!id) {
    id = "uid_" + Math.random().toString(36).slice(2);
    localStorage.setItem("zoronal_uid", id);
  }
  return id;
};

export default function ReviewCard({ review, onDeleted }) {
  const [likes, setLikes] = useState(review.likes || 0);
  const userId = getUserId();
  const [hasLiked, setHasLiked] = useState(review.likedBy?.includes(userId));
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      setLoading(true);
      const res = await likeReview(review._id, userId);
      setLikes(res.data.data.likes);
      setHasLiked(res.data.action === "liked");
    } catch {
      toast.error("Could not update like");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(review._id);
      toast.success("Review deleted");
      onDeleted(review._id);
    } catch {
      toast.error("Could not delete review");
    }
  };

  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <div className="review-card">
      <div className="review-card-top">
        <div className="reviewer-avatar">{review.fullName[0].toUpperCase()}</div>
        <div>
          <div className="reviewer-name">{review.fullName}</div>
          <div className="review-date">{date}</div>
        </div>
        <div className="review-rating-badge">
          <StarDisplay rating={review.rating} size={13} />
          <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>{review.rating}.0</span>
        </div>
      </div>

      <h4 className="review-subject">{review.subject}</h4>
      <p className="review-text">{review.reviewText}</p>

      <div className="review-actions">
        <button
          className={`like-btn ${hasLiked ? "liked" : ""}`}
          onClick={handleLike}
          disabled={loading}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          {likes} {likes === 1 ? "Like" : "Likes"}
        </button>

        <button className="share-btn" onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied!");
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </button>

        <button className="delete-review-btn" onClick={handleDelete}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
