const express = require('express');
const apiRouter = require('./apiRouter');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
//const router = require('./public/api');
dotenv.config();

const app = express();

// Define CORS options
const corsOptions = {
  origin: 'https://db-piper64-do-user-13917218-0.c.db.ondigitalocean.com', // Specify the origin(s) allowed to make requests
  methods: 'GET,POST', // Specify the HTTP methods allowed
  allowedHeaders: 'Content-Type,Authorization', // Specify the allowed headers
  credentials: true // Enable credentials (cookies, authorization headers, etc.)
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));

// Mount the router at /api/activity-log
app.use('/', apiRouter);

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection pool setup with SSL configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./certs/ca-certificate.crt').toString(), 
    },
});

// Test database connectivity on start-up
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Database connection successful:', res.rows[0].now);
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
