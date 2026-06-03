const db = require("../config/db");

// Get personal dashboard for logged-in student
const dashboard = (req, res) => {
    res.status(200).json({
        message: "Welcome to Student Dashboard",
        student: req.student
    });
};

// Get all students by year
const getStudentsByYear = (req, res) => {
    const { year } = req.params;

    if (!year || year < 1 || year > 4) {
        return res.status(400).json({ error: "Invalid year. Must be 1-4" });
    }

    const query = "SELECT id, full_name, email, department, year, created_at FROM students WHERE year = ? ORDER BY full_name ASC";

    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        res.status(200).json({
            message: `Year ${year} Students`,
            year: parseInt(year),
            count: results.length,
            students: results
        });
    });
};

// Get year-wise dashboard with practical monitoring
const getYearWiseDashboard = (req, res) => {
    const { year } = req.params;

    if (!year || year < 1 || year > 4) {
        return res.status(400).json({ error: "Invalid year. Must be 1-4" });
    }

    const query = `SELECT s.id, s.full_name, s.email, s.department, s.year,
        COUNT(pt.id) as total_practicals,
        SUM(CASE WHEN pt.status = 'Completed' THEN 1 ELSE 0 END) as completed_practicals,
        SUM(CASE WHEN pt.status = 'Submitted' THEN 1 ELSE 0 END) as submitted_practicals,
        SUM(CASE WHEN pt.status = 'Approved' THEN 1 ELSE 0 END) as approved_practicals,
        ROUND(AVG(pt.completion_percentage), 2) as avg_completion
        FROM students s
        LEFT JOIN practical_tracking pt ON s.id = pt.student_id
        WHERE s.year = ?
        GROUP BY s.id, s.full_name, s.email, s.department, s.year
        ORDER BY s.full_name ASC`;

    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        res.status(200).json({
            message: `Year ${year} Dashboard - Practical Monitoring`,
            year: parseInt(year),
            totalStudents: results.length,
            students: results
        });
    });
};

// Get practical details for a specific student
const getStudentPracticalProgress = (req, res) => {
    const { studentId } = req.params;

    const query = `SELECT s.id, s.full_name, s.email, s.department, s.year,
        pt.id as practical_id, pt.practical_name, pt.description, pt.status,
        pt.completion_percentage, pt.submitted_date, pt.approved_date, pt.remarks, pt.updated_at
        FROM students s
        LEFT JOIN practical_tracking pt ON s.id = pt.student_id
        WHERE s.id = ?
        ORDER BY pt.updated_at DESC`;

    db.query(query, [studentId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        const studentInfo = {
            id: results[0].id,
            full_name: results[0].full_name,
            email: results[0].email,
            department: results[0].department,
            year: results[0].year
        };

        const practicals = results
            .filter(r => r.practical_id !== null)
            .map(r => ({
                practical_id: r.practical_id,
                practical_name: r.practical_name,
                description: r.description,
                status: r.status,
                completion_percentage: r.completion_percentage,
                submitted_date: r.submitted_date,
                approved_date: r.approved_date,
                remarks: r.remarks,
                updated_at: r.updated_at
            }));

        res.status(200).json({
            message: "Student Practical Progress",
            student: studentInfo,
            practicals: practicals
        });
    });
};

// Add or update practical tracking for a student
const updatePracticalProgress = (req, res) => {
    const { studentId, practicalId } = req.params;
    const { practical_name, description, status, completion_percentage, remarks } = req.body;

    const validStatuses = ['Not Started', 'In Progress', 'Completed', 'Submitted', 'Approved'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    if (completion_percentage && (completion_percentage < 0 || completion_percentage > 100)) {
        return res.status(400).json({ error: "Completion percentage must be between 0-100" });
    }

    if (practicalId === 'new') {
        const insertQuery = `INSERT INTO practical_tracking 
            (student_id, practical_name, description, status, completion_percentage, remarks)
            VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(insertQuery, 
            [studentId, practical_name, description, status || 'Not Started', completion_percentage || 0, remarks || null],
            (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Database error" });
                }

                res.status(201).json({
                    message: "Practical progress added successfully",
                    practical_id: result.insertId
                });
            }
        );
    } else {
        const updateQuery = `UPDATE practical_tracking
            SET practical_name = COALESCE(?, practical_name),
                description = COALESCE(?, description),
                status = COALESCE(?, status),
                completion_percentage = COALESCE(?, completion_percentage),
                remarks = COALESCE(?, remarks),
                submitted_date = CASE WHEN ? = 'Submitted' THEN NOW() ELSE submitted_date END,
                approved_date = CASE WHEN ? = 'Approved' THEN NOW() ELSE approved_date END
            WHERE id = ? AND student_id = ?`;

        db.query(updateQuery,
            [practical_name, description, status, completion_percentage, remarks, status, status, practicalId, studentId],
            (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Database error" });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "Practical record not found" });
                }

                res.status(200).json({
                    message: "Practical progress updated successfully",
                    practical_id: practicalId
                });
            }
        );
    }
};

// Get summary statistics for a specific year
const getYearSummary = (req, res) => {
    const { year } = req.params;

    if (!year || year < 1 || year > 4) {
        return res.status(400).json({ error: "Invalid year. Must be 1-4" });
    }

    const query = `SELECT s.year,
        COUNT(DISTINCT s.id) as total_students,
        COUNT(DISTINCT pt.id) as total_practicals_assigned,
        SUM(CASE WHEN pt.status = 'Approved' THEN 1 ELSE 0 END) as approved_practicals,
        SUM(CASE WHEN pt.status = 'Submitted' THEN 1 ELSE 0 END) as pending_approval,
        ROUND(AVG(pt.completion_percentage), 2) as avg_completion_percentage
        FROM students s
        LEFT JOIN practical_tracking pt ON s.id = pt.student_id
        WHERE s.year = ?
        GROUP BY s.year`;

    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "No data found for this year" });
        }

        res.status(200).json({
            message: `Year ${year} Summary Statistics`,
            summary: results[0]
        });
    });
};

module.exports = {
    dashboard: dashboard,
    getStudentsByYear: getStudentsByYear,
    getYearWiseDashboard: getYearWiseDashboard,
    getStudentPracticalProgress: getStudentPracticalProgress,
    updatePracticalProgress: updatePracticalProgress,
    getYearSummary: getYearSummary
};