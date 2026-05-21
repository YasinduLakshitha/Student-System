const bcrypt = require("bcrypt");
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

        // Check password length
        if (password.length !== 5) {
            return res.status(400).json({
                message: "Password must contain exactly 5 digits"
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

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    registerStudent
};