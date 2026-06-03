-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    year INT CHECK (year >= 1 AND year <= 4) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create practical tracking table for monitoring student practical progress
CREATE TABLE IF NOT EXISTS practical_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    practical_name VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('Not Started', 'In Progress', 'Completed', 'Submitted', 'Approved') DEFAULT 'Not Started',
    completion_percentage INT DEFAULT 0,
    submitted_date TIMESTAMP NULL,
    approved_date TIMESTAMP NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Create year-wise dashboard view for easier querying
CREATE VIEW IF NOT EXISTS year_wise_dashboard AS
SELECT 
    s.id,
    s.full_name,
    s.email,
    s.department,
    s.year,
    COUNT(pt.id) as total_practicals,
    SUM(CASE WHEN pt.status = 'Completed' THEN 1 ELSE 0 END) as completed_practicals,
    SUM(CASE WHEN pt.status = 'Submitted' THEN 1 ELSE 0 END) as submitted_practicals,
    SUM(CASE WHEN pt.status = 'Approved' THEN 1 ELSE 0 END) as approved_practicals,
    AVG(pt.completion_percentage) as avg_completion
FROM students s
LEFT JOIN practical_tracking pt ON s.id = pt.student_id
GROUP BY s.id, s.full_name, s.email, s.department, s.year;
