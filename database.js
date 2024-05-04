console.log("Database.js file is being executed...");
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

/////////////////////////////////////////////////////// Path to your certificate
const caCertificatePath = path.join(__dirname, 'certs', 'ca-certificate.crt');

// PostgreSQL connection pool setup
const pool = new Pool({
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
    console.log('Inside callback function'); // Add this line for debugging
    if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit the script with an error code
    } else {
        console.log('Database connection successful:', res.rows[0].now);
    }
});
console.log("Database.js setup completed.");
async function getActivityLog() {
    const client = await pool.connect();
    try {
        console.log("Fetching activity log from database...");
        const result = await client.query(`
    SELECT activities.activity_type, 
       activities.case_notes, 
       activities.billable_hours, 
       participants.email, 
       participants.last_name, 
       auth.auth_end_date
FROM activities 
INNER JOIN participants ON activities.participant_id = participants.participant_id
INNER JOIN auth ON participants.participant_id = auth.participant_id
ORDER BY activities.activity_date DESC;

`);

        console.log('Fetched activity log data:', result.rows); // Logging fetched data to console
        return result.rows;
    } catch (error) {
        console.error('Error fetching activity log from database:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Function to add a new participant to the database
async function addParticipant(email, firstName, lastName, phone, registrationDate) {
    const client = await pool.connect();
    try {
        console.log("Adding participant to the database...");
        // Execute the SQL query to insert participant data
        const result = await client.query(`
            INSERT INTO participants (email, first_name, last_name, phone, registration_date)
            VALUES ($1, $2, $3, $4, $5)
        `, [email, firstName, lastName, phone, registrationDate]);
        console.log('Participant added successfully.');
        return result.rows;
    } catch (error) {
        console.error('Error adding participant to the database:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Function to add a new activity to the database
async function addActivity(participantId, activityTypeId, activityDesc, caseNotes, billableHours, activityDate) {
    const client = await pool.connect();
    try {
        // Use the new column names in the activities table
        const query = `
            INSERT INTO activities (participant_id, activity_type_id, activity_desc, case_notes, billable_hours, activity_date)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await client.query(query, [participantId, activityTypeId, activityDesc, caseNotes, billableHours, activityDate]);
        console.log('Activity added successfully.');
    } catch (error) {
        console.error('Error adding activity to the database:', error);
        throw error;
    } finally {
        client.release();
    }
}


// Function to get all participants from the database
async function getParticipants() {
    const client = await pool.connect();
    try {
        console.log("Fetching participants from the database...");
        const result = await client.query(`
            SELECT participant_id, email, first_name, last_name, phone, registration_date
            FROM participants
            ORDER BY last_name ASC
        `);

        console.log('Fetched participants data:', result.rows); // Logging fetched data to console
        return result.rows;
    } catch (error) {
        console.error('Error fetching participants:', error);
        throw error;
    } finally {
        client.release();
    }
}


async function addActivityType(type_name, activity_desc) {
    const client = await pool.connect();
    try {
        const query = 'INSERT INTO activity_types (type_name, activity_desc) VALUES ($1, $2)';
        await client.query(query, [type_name, activity_desc]);
        console.log('Activity type added successfully.');
    } catch (error) {
        console.error('Error adding activity type:', error);
        throw error;
    } finally {
        client.release();
    }
}


async function getActivityTypes() {
    const client = await pool.connect();
    try {
        const query = 'SELECT id, type_name, activity_desc FROM activity_types ORDER BY type_name';
        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching activity types:', error);
        throw error;
    } finally {
        client.release();
    }
}




module.exports = {
    addActivityType,
    getActivityTypes,
    addActivity,
    addParticipant,
    getActivityLog,
    getParticipants
};

