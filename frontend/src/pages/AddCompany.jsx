import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany } from "../utils/api";
import toast from "react-hot-toast";
import "./Form.css";

export default function AddCompany() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", description: "", location: "", city: "",
    foundedOn: "", website: "", industry: "",
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Company name is required";
    if (!form.location.trim()) errs.location = "Location is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.foundedOn) errs.foundedOn = "Founded year is required";
    else if (form.foundedOn < 1800 || form.foundedOn > new Date().getFullYear())
      errs.foundedOn = `Year must be between 1800 and ${new Date().getFullYear()}`;
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (logo) fd.append("logo", logo);

      const res = await createCompany(fd);
      toast.success("Company added!");
      navigate(`/companies/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add company");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  return (
    <main className="form-page">
      <div className="form-container">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
          <h1 className="form-title">Add Company</h1>
          <p className="form-subtitle">Fill in the details to create a new company profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="company-form">
          {/* Logo upload */}
          <div className="logo-upload-area">
            <div className="logo-preview">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" />
              ) : (
                <span className="logo-placeholder-icon">🏢</span>
              )}
            </div>
            <div>
              <label className="file-upload-btn">
                {logo ? "Change Logo" : "Upload Logo"}
                <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: "none" }} />
              </label>
              <p className="upload-hint">PNG, JPG, SVG up to 5MB</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company Name *</label>
              <input type="text" placeholder="e.g. Acme Corp" value={form.name} onChange={set("name")} className={errors.name ? "error" : ""} />
              {errors.name && <span className="err-msg">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Industry</label>
              <input type="text" placeholder="e.g. Technology" value={form.industry} onChange={set("industry")} />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} placeholder="Brief description of the company…" value={form.description} onChange={set("description")} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input type="text" placeholder="e.g. United States" value={form.location} onChange={set("location")} className={errors.location ? "error" : ""} />
              {errors.location && <span className="err-msg">{errors.location}</span>}
            </div>
            <div className="form-group">
              <label>City *</label>
              <input type="text" placeholder="e.g. San Francisco" value={form.city} onChange={set("city")} className={errors.city ? "error" : ""} />
              {errors.city && <span className="err-msg">{errors.city}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Founded On *</label>
              <input type="number" placeholder="e.g. 2010" min="1800" max={new Date().getFullYear()} value={form.foundedOn} onChange={set("foundedOn")} className={errors.foundedOn ? "error" : ""} />
              {errors.foundedOn && <span className="err-msg">{errors.foundedOn}</span>}
            </div>
            <div className="form-group">
              <label>Website</label>
              <input type="url" placeholder="https://example.com" value={form.website} onChange={set("website")} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate("/")}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating…" : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
