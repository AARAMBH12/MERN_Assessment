const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

router.get("/", getCompanies);
router.get("/:id", getCompany);
router.post("/", upload.single("logo"), createCompany);
router.put("/:id", upload.single("logo"), updateCompany);
router.delete("/:id", deleteCompany);

module.exports = router;
