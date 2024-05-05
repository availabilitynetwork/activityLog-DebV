// Import necessary modules
const express = require('express'); // Import Express for routing
const router = express.Router(); // Create an Express router instance
const { getActivityLog } = require('../database'); // Import the getActivityLog function from database.js

// Define a GET route to fetch the activity log
router.get('/', async (req, res) => {
    try {
        // Log the start of the data fetching process
        console.log("Fetching activity log...");
        
        // Call getActivityLog to retrieve all activity log data
        const activityLog = await getActivityLog();
        
        // Log successful retrieval of the data
        console.log("Activity log fetched successfully.");
        
        // Send the fetched data as a JSON response to the client
        res.json(activityLog);
    } catch (error) {
        // Log the error that occurred while fetching the data
        console.error('Error fetching activity log:', error);
        
        // Send an error response to the client
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router for use in other files (like `server.js`)
module.exports = router;

// Explanation:

//     Importing Modules:
//         Express: Required for routing.
//         getActivityLog: Function to fetch the activity logs from the database, imported from database.js.

//     Router Setup:
//         router.get defines a GET route at the root path (/) to serve the activity logs.

//     GET Route (/):
//         Logging: Logs the action of fetching the activity log data for debugging purposes.
//         Database Interaction: Calls getActivityLog to fetch all activity data.
//         Response:
//             On success, it sends the data back as a JSON response.
//             On failure, it catches and logs any errors, and responds with a status of 500, indicating a server error.

//     Export:
//         The router is exported for integration into server.js or any other appropriate file.