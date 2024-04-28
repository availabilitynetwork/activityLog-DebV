const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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
            SELECT p.email, a.activity_type, a.case_notes, a.billable_hours
            FROM activities a
            INNER JOIN participants p ON a.participant_id = p.participant_id
            ORDER BY a.activity_date DESC
        `);
        
        // Format the data into an array of objects with the specified properties
        return result.rows.map(row => ({
            email: row.email,
            activity_type: row.activity_type,
            case_notes: row.case_notes,
            billable_hours: row.billable_hours
        }));
    } finally {
        
    }
}

module.exports = { getActivityLog };
