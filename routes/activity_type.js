// Import necessary modules
const express = require('express'); // Import Express for routing
const router = express.Router(); // Create an Express router instance
const { addActivityType, getActivityTypes } = require('../database'); // Import database functions

// Define a POST route to handle adding new activity types
router.post('/', async (req, res) => {
    // Extract `type_name` and `activity_desc` from the request body
    const { type_name, activity_desc } = req.body;
    console.log('Received data:', { type_name, activity_desc });

    // Check that both `type_name` and `activity_desc` are provided
    if (!type_name || !activity_desc) {
        return res.status(400).json({ error: 'Both type_name and activity_desc are required' });
    }

    try {
        // Insert the new activity type into the database
        await addActivityType(type_name, activity_desc);
        
        // Respond with success if the addition was successful
        res.status(201).json({ message: 'Activity type added successfully' });
    } catch (error) {
        // Log any errors that occurred and respond with a 500 status code
        console.error('Error adding activity type:', error);
        res.status(500).json({ error: 'Failed to add activity type' });
    }
});

// Define a GET route to retrieve all activity types
router.get('/', async (req, res) => {
    try {
        // Fetch all activity types from the database
        const types = await getActivityTypes();
        
        // Respond with the activity types as a JSON array
        res.json(types);
    } catch (error) {
        // Log any errors that occurred and respond with a 500 status code
        console.error('Error fetching activity types:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Define a GET route to fetch the description of an activity type by its ID
router.get('/description/:id', async (req, res) => {
    const { id } = req.params; // Extract the `id` parameter from the request

    try {
        // Query to fetch the description for the specified activity type ID
        const query = 'SELECT activity_desc FROM activity_types WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length > 0) {
            // If a result was found, respond with the description
            res.status(200).json({ activity_desc: result.rows[0].activity_desc });
        } else {
            // If no result was found, respond with a 404 status code
            res.status(404).json({ error: 'No description found for the specified type.' });
        }
    } catch (error) {
        // Log any errors that occurred and respond with a 500 status code
        console.error('Error fetching description:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Export the router for use in other files (like `server.js`)
module.exports = router;


// Explanation:

//     Importing Modules:
//         Express: Required for routing.
//         Database Functions: addActivityType and getActivityTypes are used to interact with the database.

//     Router Setup:
//         router.post handles POST requests to add a new activity type.
//         router.get handles GET requests to fetch all activity types.
//         The second router.get fetches an activity description by a specific ID.

//     POST Route (/):
//         Data Extraction: Extracts type_name and activity_desc from the request body.
//         Validation: Checks for the presence of required fields.
//         Database Interaction: Calls addActivityType to insert a new record into the database.
//         Response: Returns a success message on success or an error on failure.

//     GET Routes:
//         All Types (/):
//             Calls getActivityTypes to fetch all activity types.
//             Returns a JSON array of activity types or an error response.
//         Description by ID (/description/:id):
//             Retrieves an activity description by ID, querying directly from the database.
//             Returns the description or an error if none is found.

//     Export:
//         The router is exported to integrate the activity types API into the main server file (server.js).