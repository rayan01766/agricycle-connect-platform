const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// =====================
// CORS (EXPLICIT & SIMPLE)
// =====================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// IMPORTANT: handle preflight explicitly
app.options("*", cors());

// =====================
// Middleware
// =====================
app.use(express.json());

// =====================
// Database
// =====================
const { pool } = require("./config/db");

// =====================
// Routes
// =====================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/waste", require("./routes/wasteRoutes"));

// Health check
app.get("/", (req, res) => {
  res.send("AgriCycle Connect API is running");
});

// DB test (keep or remove later)
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "DB OK",
      time: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: "DB ERROR",
      error: err.message
    });
  }
});

// =====================
// Start Server
// =====================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
