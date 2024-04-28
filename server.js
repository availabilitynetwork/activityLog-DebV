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
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error testing the database connection:', err);
    } else {
        console.log('Database connection time:', res.rows[0].now);
    }
});

app.get('/api/test-db', async (req, res) => {
    try {
        const dbRes = await pool.query('SELECT NOW()');
        res.json({ success: true, time: dbRes.rows[0].now });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ success: false, message: 'Failed to connect to the database.' });
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// RESTful API routes///////////////////////////////////////////////////////////////
// 




app.listen(port, () => console.log(`Server running on port ${port}`));
