try {
  console.log("Requiring routes...");
  const routes = require('./routes/studentRoutes');
  console.log("Routes loaded successfully!");
  console.log("Routes type:", typeof routes);
} catch (e) {
  console.error("Error requiring routes:", e.message);
  console.error(e.stack);
}
