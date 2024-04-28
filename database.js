// database.js

const { Pool } = require('pg');
const pool = new Pool(/* your database connection configuration */);

async function getActivityLog() {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT p.email, a.activity_type, a.case_notes, a.billable_hours
            FROM activities a
            INNER JOIN participants p ON a.participant_id = p.participant_id
            ORDER BY a.activity_date DESC
        `);
        return result.rows;
    } finally {
        client.release();
    }
}

module.exports = { getActivityLog };
