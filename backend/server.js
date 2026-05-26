require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const app = express();
const authRoutes = require("./routes/authRoutes");

// TODO: Fix studentRoutes export issue
// const studentRoutes = require("./routes/studentRoutes");

app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use("/api/auth", authRoutes);
// app.use("/api/student", studentRoutes);

app.get("/", (req, res) => {
    res.send("Backend Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});