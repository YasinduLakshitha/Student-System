const sc = require('./controllers/studentController');
console.log("Exports:", Object.keys(sc));
console.log("dashboard type:", typeof sc.dashboard);
console.log("getStudentsByYear type:", typeof sc.getStudentsByYear);
