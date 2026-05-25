import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Companies
export const getCompanies = (params) => api.get("/companies", { params });
export const getCompany = (id) => api.get(`/companies/${id}`);
export const createCompany = (formData) =>
  api.post("/companies", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateCompany = (id, formData) =>
  api.put(`/companies/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteCompany = (id) => api.delete(`/companies/${id}`);

// Reviews
export const getReviews = (params) => api.get("/reviews", { params });
export const createReview = (data) => api.post("/reviews", data);
export const likeReview = (id, userId) => api.post(`/reviews/${id}/like`, { userId });
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

export default api;
