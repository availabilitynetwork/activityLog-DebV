// Importing required modules
const { Pool } = require('pg'); // PostgreSQL client for connection pooling and querying
const fs = require('fs'); // Node.js File System module to read the certificate file
const path = require('path'); // Node.js Path module to handle file paths

// Load environment variables from `.env` file into `process.env`
require('dotenv').config();

// Specify the path to the CA certificate (required for SSL connection)
const caCertificatePath = path.join(__dirname, 'certs', 'ca-certificate.crt');

// Setup PostgreSQL connection pool using environment variables
const pool = new Pool({
    host: process.env.DB_HOST, // Database server host
    database: process.env.DB_NAME, // Database name
    password: process.env.DB_PASS, // Database password
    port: process.env.DB_PORT, // Database port
    ssl: {
        rejectUnauthorized: true, // Enforce SSL validation for security
        ca: fs.readFileSync(caCertificatePath).toString() // Read the CA certificate file for SSL
    }
});

// Test database connectivity on start-up
pool.query('SELECT NOW()', (err, res) => {
    console.log('Inside callback function'); // Debug message for the callback function
    if (err) {
        console.error('Database connection error:', err.message); // Log error message if connection fails
        process.exit(1); // Exit the script with an error code
    } else {
        console.log('Database connection successful:', res.rows[0].now); // Log successful connection time
    }
});
console.log("Database.js setup completed.");

// Function to fetch activity logs by joining relevant tables
async function getActivityLog() {
    const client = await pool.connect(); // Obtain a client from the pool
    try {
        console.log("Fetching activity log from the database...");
        // SQL query to fetch all activities along with participant and authorization details
        const query = `
        SELECT
            activities.activity_desc,
            activities.case_notes,
            activities.billable_hours,
            participants.email,
            participants.last_name,
            auth.auth_end_date,
            activity_types.type_name
        FROM
            activities
        INNER JOIN
            participants ON activities.participant_id = participants.participant_id
        INNER JOIN
            auth ON participants.participant_id = auth.participant_id
        INNER JOIN
            activity_types ON activities.activity_type_id = activity_types.id
        ORDER BY
            activities.activity_date DESC;
        `;
        const result = await client.query(query); // Execute the query

        console.log('Fetched activity log data:', result.rows); // Log retrieved data
        return result.rows; // Return the retrieved data
    } catch (error) {
        console.error('Error fetching activity log from the database:', error); // Log any errors
        throw error; // Rethrow the error for further handling
    } finally {
        client.release(); // Release the client back to the pool
    }
}

// Function to add a new participant to the database
async function addParticipant(email, firstName, lastName, phone, registrationDate) {
    const client = await pool.connect(); // Obtain a client from the pool
    try {
        console.log("Adding participant to the database...");
        // SQL query to insert participant data into the `participants` table
        const result = await client.query(`
            INSERT INTO participants (email, first_name, last_name, phone, registration_date)
            VALUES ($1, $2, $3, $4, $5)
        `, [email, firstName, lastName, phone, registrationDate]); // Pass parameters to the query
        console.log('Participant added successfully.');
        return result.rows; // Return the inserted row(s)
    } catch (error) {
        console.error('Error adding participant to the database:', error); // Log any errors
        throw error; // Rethrow the error for further handling
    } finally {
        client.release(); // Release the client back to the pool
    }
}

// Function to add a new activity to the database
async function addActivity(participantId, activityTypeId, activityDesc, caseNotes, billableHours, activityDate) {
    const client = await pool.connect(); // Obtain a client from the pool
    try {
        // SQL query to insert an activity into the `activities` table
        const query = `
            INSERT INTO activities (participant_id, activity_type_id, activity_desc, case_notes, billable_hours, activity_date)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await client.query(query, [participantId, activityTypeId, activityDesc, caseNotes, billableHours, activityDate]);
        console.log('Activity added successfully.');
    } catch (error) {
        console.error('Error adding activity to the database:', error); // Log any errors
        throw error; // Rethrow the error for further handling
    } finally {
        client.release(); // Release the client back to the pool
    }
}

// Function to fetch all participants from the database
async function getParticipants() {
    const client = await pool.connect(); // Obtain a client from the pool
    try {
        console.log("Fetching participants from the database...");
        // SQL query to fetch participant details ordered by last name
        const result = await client.query(`
            SELECT participant_id, email, first_name, last_name, phone, registration_date
            FROM participants
            ORDER BY last_name ASC
        `);
        console.log('Fetched participants data:', result.rows); // Log retrieved data
        return result.rows; // Return the retrieved data
    } catch (error) {
        console.error('Error fetching participants:', error); // Log any errors
        throw error; // Rethrow the error for further handling
    } finally {
        client.release(); // Release the client back to the pool
    }
}

// Function to add a new activity type to the `activity_types` table
async function addActivityType(type_name, activity_desc) {
    const client = await pool.connect(); // Obtain a client from the pool
    try {
        // SQL query to insert a new activity type into the `activity_types` table
        const query = 'INSERT INTO activity_types (type_name, activity_desc) VALUES ($1, $2)';
        await client.query(query, [type_name, activity_desc]); // Pass parameters to the query
        console.log('Activity type added successfully.');
    } catch (error) {
        console.error('Error adding activity type:', error); // Log any errors
        throw error; // Rethrow the error for further handling
    } finally {
        client.release(); // Release the client back to the pool
    }
}

// Function to find or add a new activity type
async function findOrAddActivityType(type_name) {
    const client = await pool.connect(); // Obtain a client from the pool
    try {
        // SQL query to find an existing activity type
        const findQuery = 'SELECT id FROM activity_types WHERE type_name = $1';
        const findResult = await client.query(findQuery, [type_name]);

        if (findResult.rows.length > 0) {
            // If the activity type exists, return its ID
            return findResult.rows[0].id;
        }

        // SQL query to add a new activity type if not found
        const insertQuery = 'INSERT INTO activity_types (type_name) VALUES ($1) RETURNING id';
        const insertResult = await client.query(insertQuery, [type_name]);

        // Return the newly inserted activity type ID
        return insertResult.rows[0].id;
    } catch (error) {
        console.error('Error finding or adding activity type:', error); // Log any errors
        throw error; // Rethrow the error for further handling
    } finally {
        client.release(); // Release the client back to the pool
    }
}

// Function to fetch all activity types from the database
async function getActivityTypes() {
    const client = await pool.connect(); // Obtain a client from the pool
    try {
        // SQL query to fetch activity type details ordered by type name
        const query = 'SELECT id, type_name, activity_desc FROM activity_types ORDER BY type_name';
        const result = await client.query(query); // Execute the query
        return result.rows; // Return the retrieved rows
    } catch (error) {
        console.error('Error fetching activity types:', error); // Log any errors
        throw error; // Rethrow the error for further handling
    } finally {
        client.release(); // Release the client back to the pool
    }
}

async function addAuthorization(
    participantId,
    authNumber,
    authBillableHours,
    authBeginDate,
    authEndDate,
    authDetails
) {
    const client = await pool.connect();
    try {
        // Log parameters to check for any issues
        console.log({
            participantId,
            authNumber, // Confirm this remains a string
            authBillableHours,
            authBeginDate,
            authEndDate,
            authDetails
        });

        // Ensure that the query matches the data types in the `auth` table
        const query = `
            INSERT INTO auth (participant_id, auth_number, auth_billable_hours, auth_begin_date, auth_end_date, auth_details)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await client.query(query, [
            participantId,
            authNumber,
            authBillableHours,
            authBeginDate,
            authEndDate,
            authDetails
        ]);
        console.log('Authorization added successfully.');
    } catch (error) {
        console.error('Error adding authorization to the database:', error);
        throw error;
    } finally {
        client.release();
    }
}


// Export the functions for use in other modules
module.exports = {
    addAuthorization,
    addActivityType,
    getActivityTypes,
    findOrAddActivityType,
    addActivity,
    addParticipant,
    getActivityLog,
    getParticipants
};


// Explanation:

//     Database Connection:
//         The database connection is handled using pg's Pool to efficiently manage connections.

//     Connection Pooling:
//         The connection pool ensures optimized use of connections to the database.

//     Functions:
//         Each function is asynchronous, ensuring non-blocking execution and efficient handling of client connections.
//         Functions cover key operations like adding, finding, and fetching entities, each safely managing connections.

//     Error Handling:
//         Errors are logged and thrown to be properly handled by the calling functions.

//     Modularity:
//         Functions are organized and exported for easy reuse across multiple files.