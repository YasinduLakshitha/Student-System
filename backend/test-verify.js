console.log("Testing verifyToken load...");
delete require.cache[require.resolve('./middleware/authMiddleware')];
const vT = require('./middleware/authMiddleware');
console.log("verifyToken:", vT);
console.log("Type:", typeof vT);
console.log("Is function:", typeof vT === 'function');
