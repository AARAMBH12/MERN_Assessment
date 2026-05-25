import { useNavigate } from "react-router-dom";
import { StarDisplay } from "./StarRating";
import "./CompanyCard.css";

export default function CompanyCard({ company }) {
  const navigate = useNavigate();
  const initials = company.name.slice(0, 2).toUpperCase();

  return (
    <div className="company-card" onClick={() => navigate(`/companies/${company._id}`)}>
      <div className="company-card-header">
        {company.logo ? (
          <img src={company.logo} alt={company.name} className="company-logo" />
        ) : (
          <div className="company-logo-placeholder">{initials}</div>
        )}
        <div className="company-card-meta">
          <h3 className="company-card-name">{company.name}</h3>
          <span className="company-card-location">
            📍 {company.city}, {company.location}
          </span>
        </div>
      </div>

      {company.description && (
        <p className="company-card-desc">{company.description.slice(0, 120)}{company.description.length > 120 ? "…" : ""}</p>
      )}

      <div className="company-card-footer">
        <div className="company-card-rating">
          <StarDisplay rating={company.averageRating} size={14} />
          <span className="rating-val">{company.averageRating > 0 ? company.averageRating.toFixed(1) : "No ratings"}</span>
          {company.totalReviews > 0 && (
            <span className="review-count">({company.totalReviews} review{company.totalReviews !== 1 ? "s" : ""})</span>
          )}
        </div>
        <span className="badge">Est. {company.foundedOn}</span>
      </div>
    </div>
  );
}
