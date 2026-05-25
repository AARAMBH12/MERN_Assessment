import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompany, getReviews, deleteCompany } from "../utils/api";
import { StarDisplay } from "../components/StarRating";
import ReviewCard from "../components/ReviewCard";
import AddReviewModal from "../components/AddReviewModal";
import toast from "react-hot-toast";
import "./CompanyDetail.css";

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  useEffect(() => {
    getCompany(id)
      .then((r) => setCompany(r.data.data))
      .catch(() => toast.error("Company not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const fetchReviews = useCallback(async (page = 1) => {
    setReviewsLoading(true);
    try {
      const res = await getReviews({ companyId: id, sortBy, order, page, limit: 8 });
      setReviews(res.data.data);
      setAvgRating(res.data.averageRating);
      setTotalReviews(res.data.totalReviews);
      setPagination(res.data.pagination);
    } finally {
      setReviewsLoading(false);
    }
  }, [id, sortBy, order]);

  useEffect(() => { fetchReviews(1); }, [fetchReviews]);

  const handleDeleteCompany = async () => {
    if (!confirm(`Delete "${company.name}" and all its reviews?`)) return;
    try {
      await deleteCompany(id);
      toast.success("Company deleted");
      navigate("/");
    } catch {
      toast.error("Could not delete company");
    }
  };

  const handleReviewAdded = (review) => {
    setReviews((prev) => [review, ...prev]);
    setTotalReviews((n) => n + 1);
    fetchReviews(1);
  };

  const handleReviewDeleted = (rid) => {
    setReviews((prev) => prev.filter((r) => r._id !== rid));
    fetchReviews(1);
  };

  if (loading) return <div className="page-center"><div className="spinner" /></div>;
  if (!company) return <div className="page-center"><p>Company not found.</p></div>;

  const initials = company.name.slice(0, 2).toUpperCase();
  const ratingBars = [5, 4, 3, 2, 1];

  return (
    <main className="cd-page">
      {/* Company Header */}
      <section className="cd-header">
        <div className="cd-header-inner">
          <button className="back-btn" onClick={() => navigate("/")}>← Back</button>

          <div className="cd-company-info">
            <div className="cd-logo">
              {company.logo ? (
                <img src={company.logo} alt={company.name} />
              ) : (
                <div className="cd-logo-placeholder">{initials}</div>
              )}
            </div>
            <div>
              <h1 className="cd-company-name">{company.name}</h1>
              <div className="cd-meta">
                <span>📍 {company.city}, {company.location}</span>
                <span>🗓 Est. {company.foundedOn}</span>
                {company.industry && <span className="badge">{company.industry}</span>}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" className="website-link">
                    🔗 Website
                  </a>
                )}
              </div>
              {company.description && <p className="cd-desc">{company.description}</p>}
            </div>
          </div>

          <button className="btn btn-danger delete-company-btn" onClick={handleDeleteCompany}>
            Delete Company
          </button>
        </div>
      </section>

      {/* Rating Summary */}
      <section className="cd-rating-summary">
        <div className="cd-rating-summary-inner">
          <div className="rating-big">
            <span className="rating-number">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</span>
            <div>
              <StarDisplay rating={avgRating} size={20} />
              <p className="rating-total">{totalReviews} {totalReviews === 1 ? "review" : "reviews"}</p>
            </div>
          </div>

          {/* Rating distribution bars */}
          <div className="rating-bars">
            {ratingBars.map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="rating-bar-row">
                  <span className="bar-label">{star}★</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="bar-count">{count}</span>
                </div>
              );
            })}
          </div>

          <button className="btn btn-primary add-review-btn" onClick={() => setShowModal(true)}>
            + Add Review
          </button>
        </div>
      </section>

      {/* Reviews */}
      <section className="cd-reviews">
        <div className="cd-reviews-header">
          <h2 className="reviews-title">Reviews</h2>
          <div className="reviews-controls">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="createdAt">Date</option>
              <option value="rating">Rating</option>
              <option value="likes">Most Liked</option>
            </select>
            <button
              className="order-btn"
              onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
            >
              {order === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>
          </div>
        </div>

        {reviewsLoading ? (
          <div className="page-center"><div className="spinner" /></div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. <button onClick={() => setShowModal(true)}>Be the first!</button></p>
          </div>
        ) : (
          <>
            <div className="reviews-list">
              {reviews.map((r) => (
                <ReviewCard key={r._id} review={r} onDeleted={handleReviewDeleted} />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`page-btn ${pagination.page === p ? "active" : ""}`}
                    onClick={() => fetchReviews(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {showModal && (
        <AddReviewModal
          companyId={id}
          onClose={() => setShowModal(false)}
          onAdded={handleReviewAdded}
        />
      )}
    </main>
  );
}
