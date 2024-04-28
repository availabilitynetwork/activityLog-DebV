const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

/////////////////////////////////////////////////////// Path to your certificate
const caCertificatePath = path.join(__dirname, 'certs', 'ca-certificate.crt');

/////////////////////////////////////////////////////// CORS configuration
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
    optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight across-the-board
app.use(express.static('public'));
app.use(express.json());

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
        rejectUnauthorized: true, // Make sure to enforce SSL validation in production for security
        ca: fs.readFileSync(caCertificatePath).toString() // Read the CA certificate
    }
});


// Test database connectivity on start-up
app.get('/api/participant', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM participants');  // Ensure correct table name
        res.json([result.rows]); // Wrap result.rows in an array if it's not already
    } catch (err) {
        console.error('Failed to retrieve data:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// RESTful API routes///////////////////////////////////////////////////////////////
// 

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM your_table'); // Adjust SQL query as needed
        res.json(result.rows);
    } catch (err) {
        console.error('Failed to retrieve data:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.listen(port, () => console.log(`Server running on port ${port}`));
