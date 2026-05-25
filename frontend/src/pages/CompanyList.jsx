import { useState, useEffect, useCallback } from "react";
import { getCompanies } from "../utils/api";
import CompanyCard from "../components/CompanyCard";
import "./CompanyList.css";

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchCompanies = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getCompanies({ search, city, sortBy, order, page, limit: 9 });
      setCompanies(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [search, city, sortBy, order]);

  useEffect(() => {
    const timer = setTimeout(() => fetchCompanies(1), 300);
    return () => clearTimeout(timer);
  }, [fetchCompanies]);

  return (
    <main className="company-list-page">
      {/* Hero */}
      <section className="cl-hero">
        <div className="cl-hero-inner">
          <h1 className="cl-hero-title">
            Discover &amp; Review<br />
            <span className="accent-text">Companies</span>
          </h1>
          <p className="cl-hero-sub">
            Explore company profiles, read authentic reviews, and share your experience.
          </p>
        </div>
        <div className="cl-hero-blob" aria-hidden />
      </section>

      {/* Filters */}
      <section className="cl-filters">
        <div className="cl-filters-inner">
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search companies…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <input
            type="text"
            placeholder="Filter by city…"
            className="city-filter"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="createdAt">Newest</option>
            <option value="name">Name A-Z</option>
            <option value="averageRating">Top Rated</option>
            <option value="totalReviews">Most Reviewed</option>
            <option value="foundedOn">Founded Year</option>
          </select>

          <button
            className="order-btn"
            onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
            title={order === "asc" ? "Ascending" : "Descending"}
          >
            {order === "asc" ? "↑ Asc" : "↓ Desc"}
          </button>
        </div>

        <span className="result-count">
          {pagination.total} {pagination.total === 1 ? "company" : "companies"}
        </span>
      </section>

      {/* Grid */}
      <section className="cl-grid-section">
        {loading ? (
          <div className="page-center">
            <div className="spinner" />
          </div>
        ) : companies.length === 0 ? (
          <div className="page-center">
            <div className="empty-icon">🏢</div>
            <p className="empty-msg">No companies found. <a href="/companies/new">Add one!</a></p>
          </div>
        ) : (
          <div className="company-grid">
            {companies.map((c) => (
              <CompanyCard key={c._id} company={c} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn ${pagination.page === p ? "active" : ""}`}
                onClick={() => fetchCompanies(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
