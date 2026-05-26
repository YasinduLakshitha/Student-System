const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const registerStudent = async (req, res) => {

    try {

        const { full_name, email, password, department } = req.body;

        // Check empty fields
        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        // Check password length (minimum 6 characters)
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // Check if email already exists
        const checkEmailSql = "SELECT email FROM students WHERE email = ?";
        db.query(checkEmailSql, [email], async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert into database
            const sql = `
                INSERT INTO students 
                (full_name, email, password, department)
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                sql,
                [full_name, email, hashedPassword, department],
                (err, result) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            message: "Database error",
                            error: err.message
                        });
                    }

                    res.status(201).json({
                        message: "Student registered successfully"
                    });
                }
            );
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const loginStudent = (req, res) => {

    try {

        const { email, password } = req.body;

        // Check empty fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        // Find student by email
        const sql = "SELECT * FROM students WHERE email = ?";

        db.query(sql, [email], async (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            // Check if user exists
            if (result.length === 0) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            const student = result[0];

            // Compare password
            const isMatch = await bcrypt.compare(
                password,
                student.password
            );

            // Wrong password
            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid password"
                });
            }

            // Create JWT token
            const token = jwt.sign(
                {
                    id: student.id,
                    email: student.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            // Success response
            res.status(200).json({
                message: "Login successful",
                token: token,
                student: {
                    id: student.id,
                    full_name: student.full_name,
                    email: student.email,
                    department: student.department
                }
            });

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    registerStudent,
    loginStudent
};