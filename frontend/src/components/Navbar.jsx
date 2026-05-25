import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-z">Z</span>oronal
      </Link>
      <div className="navbar-actions">
        <Link to="/" className="nav-link">Companies</Link>
        <button className="btn btn-primary" onClick={() => navigate("/companies/new")}>
          + Add Company
        </button>
      </div>
    </nav>
  );
}
