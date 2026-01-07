const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
const { pool } = require('./config/db');

// Test DB Connection
pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Database connection error:', err));


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/waste', require('./routes/wasteRoutes'));

app.get('/', (req, res) => {
    res.send('AgriCycle Connect API is running');
});


// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = { app, pool };

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

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

