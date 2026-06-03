console.log("Loading express...");
const express = require("express");
const router = express.Router();

console.log("Loading verifyToken...");
const verifyToken = require("./middleware/authMiddleware");
console.log("verifyToken type:", typeof verifyToken);

console.log("Loading studentController...");
const studentController = require("./controllers/studentController");
console.log("studentController keys:", Object.keys(studentController));
console.log("dashboard type:", typeof studentController.dashboard);

console.log("Setting up first route...");
router.get("/dashboard", verifyToken, studentController.dashboard);
console.log("First route set successfully!");
