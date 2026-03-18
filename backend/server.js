const express = require("express");
const cors = require("cors");
require("dotenv").config();
const startReminderCron = require("./services/reminderCron");

const app = express();

app.use(cors());
app.use(express.json());


// Database Connection
require("./config/db")();
startReminderCron();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/checkin", require("./routes/checkinRoutes"));
app.use("/api", require("./routes/insightRoutes"));
app.use("/api", require("./routes/dashboardRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/risk-actions", require("./routes/riskActions"));
app.use("/api/recommendations",require("./routes/recommendationRoutes"));
const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});