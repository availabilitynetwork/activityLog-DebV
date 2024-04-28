const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const activityLogRoutes = require('./api/activity-log/activityLogRoutes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

/////////////////////////////////////////////////////// Path to your certificate
const caCertificatePath = path.join(__dirname, 'certs', 'ca-certificate.crt');

// PostgreSQL connection pool setup
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(caCertificatePath).toString()
    }
});

// Test database connectivity on start-up
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    } else {
        console.log('Database connection successful:', res.rows[0].now);
    }
});

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (["https://sea-turtle-app-2b56e.ondigitalocean.app/", "http://localhost:3000"].indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 204
};

// Use cors middleware
app.use(cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url} with headers ${JSON.stringify(req.headers)}`);
    next();
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to fetch activity log data
app.get('/api/activity-log', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT p.email, a.activity_type, a.case_notes, a.billable_hours
            FROM activities a
            INNER JOIN participants p ON a.participant_id = p.participant_id
            ORDER BY a.activity_date DESC
        `);
        const activityLog = result.rows;
        client.release();
        console.log('Activity Log:', activityLog);
        res.json(activityLog);
    } catch (error) {
        console.error('Error fetching activity log:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mount the activityLogRoutes on the /api/activity-log/ path
app.use('/api/activity-log', activityLogRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
