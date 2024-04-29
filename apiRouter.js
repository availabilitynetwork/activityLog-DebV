const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

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

// Route to fetch activity log data
router.get('/activity-log', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT p.participant_id, p.email, a.activity_type, a.case_notes, a.billable_hours
            FROM activities a
            INNER JOIN participants p ON a.participant_id = p.participant_id
            ORDER BY a.activity_date DESC
        `);
        const activityLog = result.rows;
        client.release();
        res.json(activityLog);
    } catch (error) {
        console.error('Error fetching activity log:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
