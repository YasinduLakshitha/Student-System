const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const studentController = require("../controllers/studentController");

// Personal dashboard
router.get("/dashboard", verifyToken, studentController.dashboard);

// Year-wise endpoints
router.get("/year/:year/students", verifyToken, studentController.getStudentsByYear);
router.get("/year/:year/dashboard", verifyToken, studentController.getYearWiseDashboard);
router.get("/year/:year/summary", verifyToken, studentController.getYearSummary);

// Practical tracking endpoints
router.get("/:studentId/practical-progress", verifyToken, studentController.getStudentPracticalProgress);
router.post("/:studentId/practical/:practicalId", verifyToken, studentController.updatePracticalProgress);

module.exports = router;