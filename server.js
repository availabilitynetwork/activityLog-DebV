const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const port = process.env.PORT || 3000; // Use environment variable or default
const app = express();


// CORS configuration

const corsOptions = {
    origin: [process.env.CORS_ORIGIN, 'http://localhost:3000'], // Set this in your environment and add localhost
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(express.static('public'));
app.use(cors(corsOptions));

app.use(express.json()); // Middleware to parse JSON bodies
app.options('*', cors(corsOptions)); // Enable preflight for all routes

app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url} with headers ${JSON.stringify(req.headers)}`);
    next();
});

// PostgreSQL connection pool setup
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true // Make sure to enforce SSL validation in production for security
    }
});

// Test database connectivity on start-up
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error testing the database connection:', err);
    } else {
        console.log('Database connection time:', res.rows[0].now);
    }
});

// Endpoint to add a new participant
app.post('/participants', async (req, res) => {
    console.log("Received POST request for /participants");
    const { email, firstName, lastName, phone } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO participants (email, first_name, last_name, phone) VALUES ($1, $2, $3, $4) RETURNING *;',
            [email, firstName, lastName, phone]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding participant:', error);
        res.status(500).send({ message: 'Server error', error: error.message });

    }
});

// Endpoint to add a new activity
app.post('/activities', async (req, res) => {
    console.log("Received POST request for /activities");
    const { participantId, activityType, activityDescription, caseNotes, billableHours } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO activities (participant_id, activity_type, description, case_notes, billable_hours) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
            [participantId, activityType, activityDescription, caseNotes, billableHours]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding activity:', error);
        res.status(500).send({ message: 'Server error', error: error.message });
    }
});


app.listen(port, () => console.log(`Server running on port ${port}`));


// HostId: e80473f-nyc3d-nyc3-zg04