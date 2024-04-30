const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

/////////////////////////////////////////////////////// Path to your certificate
const caCertificatePath = path.join(__dirname, 'certs', 'ca-certificate.crt');

// PostgreSQL connection pool setup
const pool = new Pool({
    // user: process.env.DB_USER, // Comment out the user
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 25060, // Update the port here
    ssl: {
        rejectUnauthorized: true, // Make sure to enforce SSL validation in production for security
        ca: fs.readFileSync(caCertificatePath).toString() // Read the CA certificate
    }
});

// Test database connectivity on start-up
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit the script with an error code
    } else {
        console.log('Database connection successful:', res.rows[0].now);
    }
});

async function getActivityLog() {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * FROM participants
        `);
        console.log('Fetched participant data:', result.rows); // Logging fetched data to console
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}


module.exports = { getActivityLog };
