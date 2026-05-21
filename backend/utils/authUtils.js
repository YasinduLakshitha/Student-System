const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Hash a password
async function hashPassword(password) {
    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        return hash;
    } catch (error) {
        throw new Error(`Password hashing failed: ${error.message}`);
    }
}

// Compare password with hash
async function comparePassword(password, hash) {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        throw new Error(`Password comparison failed: ${error.message}`);
    }
}

// Generate JWT token
function generateToken(userId, email) {
    try {
        const token = jwt.sign(
            { userId, email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        return token;
    } catch (error) {
        throw new Error(`Token generation failed: ${error.message}`);
    }
}

// Verify JWT token
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error(`Token verification failed: ${error.message}`);
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
};
