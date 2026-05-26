const express = require("express");

const router = express.Router();

let registerStudent, loginStudent;

try {
    const authController = require("../controllers/authController");
    registerStudent = authController.registerStudent;
    loginStudent = authController.loginStudent;
    console.log("Auth controller loaded successfully");
} catch (error) {
    console.error("Error loading auth controller:", error);
}

router.post("/register", (req, res) => {
    console.log("Register endpoint called");
    registerStudent(req, res);
});

router.post("/login", (req, res) => {
    console.log("Login endpoint called");
    loginStudent(req, res);
});

module.exports = router;