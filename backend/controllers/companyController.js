const Company = require("../models/Company");
const Review = require("../models/Review");

// GET /api/companies
exports.getCompanies = async (req, res) => {
  try {
    const { search, city, industry, sortBy = "createdAt", order = "desc", page = 1, limit = 10 } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }
    if (city) filter.city = { $regex: city, $options: "i" };
    if (industry) filter.industry = { $regex: industry, $options: "i" };

    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Company.countDocuments(filter);
    const companies = await Company.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: companies,
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

// GET /api/companies/:id
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/companies
exports.createCompany = async (req, res) => {
  try {
    const { name, description, location, city, foundedOn, website, industry } = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : null;

    const company = await Company.create({
      name, description, location, city, foundedOn: parseInt(foundedOn),
      website, industry, logo,
    });

    res.status(201).json({ success: true, data: company, message: "Company created successfully" });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/companies/:id
exports.updateCompany = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.logo = `/uploads/${req.file.filename}`;
    if (updates.foundedOn) updates.foundedOn = parseInt(updates.foundedOn);

    const company = await Company.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    });

    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, data: company, message: "Company updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/companies/:id
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    await Review.deleteMany({ company: req.params.id });
    res.json({ success: true, message: "Company and associated reviews deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Helper: recalculate average rating for a company
exports.recalculateRating = async (companyId) => {
  const result = await Review.aggregate([
    { $match: { company: companyId } },
    { $group: { _id: "$company", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const avg = result[0]?.avg || 0;
  const count = result[0]?.count || 0;

  await Company.findByIdAndUpdate(companyId, {
    averageRating: Math.round(avg * 10) / 10,
    totalReviews: count,
  });
};
