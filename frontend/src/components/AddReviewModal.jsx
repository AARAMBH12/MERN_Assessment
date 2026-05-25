import { useState } from "react";
import { createReview } from "../utils/api";
import { StarInput } from "./StarRating";
import toast from "react-hot-toast";
import "./Modal.css";

export default function AddReviewModal({ companyId, onClose, onAdded }) {
  const [form, setForm] = useState({ fullName: "", subject: "", reviewText: "", rating: 0 });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.reviewText.trim()) errs.reviewText = "Review text is required";
    if (!form.rating) errs.rating = "Please select a rating";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const res = await createReview({ ...form, companyId });
      toast.success("Review posted!");
      onAdded(res.data.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post review");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Review</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.fullName}
              onChange={set("fullName")}
              className={errors.fullName ? "error" : ""}
            />
            {errors.fullName && <span className="err-msg">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              placeholder="Review subject"
              value={form.subject}
              onChange={set("subject")}
              className={errors.subject ? "error" : ""}
            />
            {errors.subject && <span className="err-msg">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label>Review</label>
            <textarea
              rows={4}
              placeholder="Share your experience..."
              value={form.reviewText}
              onChange={set("reviewText")}
              className={errors.reviewText ? "error" : ""}
            />
            {errors.reviewText && <span className="err-msg">{errors.reviewText}</span>}
          </div>

          <div className="form-group">
            <label>Rating</label>
            <StarInput value={form.rating} onChange={(v) => { setForm((p) => ({ ...p, rating: v })); setErrors((p) => ({ ...p, rating: "" })); }} />
            {errors.rating && <span className="err-msg">{errors.rating}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Posting…" : "Post Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
