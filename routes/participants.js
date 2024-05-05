// Import necessary modules and functions
const express = require('express'); // Import Express for routing
const router = express.Router(); // Create an Express router instance

// Import relevant functions from the `database.js` file
const { addParticipant } = require('../database'); // Function to add a participant to the database
const { getParticipants } = require('../database'); // Function to fetch all participants

// Define a POST route to handle adding a new participant
router.post('/', async (req, res) => {
    // Extract participant data from the request body
    const { email, firstName, lastName, phone, registrationDate } = req.body;

    try {
        // Insert participant data into the database by calling `addParticipant`
        await addParticipant(email, firstName, lastName, phone, registrationDate);

       // Redirect to a success page with a query parameter
        res.redirect(`/success?message=${encodeURIComponent('Participant added successfully!')}`);
    } catch (error) {
        console.error('Error adding participant:', error);
        // Redirect to an error page with a query parameter
        res.redirect(`/error?message=${encodeURIComponent('Failed to add participant')}`);
    }
});

// Define a GET route to handle fetching all participants
router.get('/', async (req, res) => {
    try {
        // Fetch participants from the database by calling `getParticipants`
        const participants = await getParticipants();

        // Send the fetched participants data as a JSON response to the client
        res.json(participants);
    } catch (error) {
        // Log the error and send an appropriate error response to the client
        console.error('Error fetching participants:', error);
        res.status(500).json({ message: 'Error fetching participants' });
    }
});

// Export the router to be used in other files (like `server.js`)
module.exports = router;


// Explanation:

//     Importing Modules:
//         express is imported to handle HTTP routing with Router.
//         addParticipant and getParticipants are imported from database.js for interacting with the database.

//     Router Setup:
//         router.post handles POST requests for adding participants.
//         router.get handles GET requests for fetching participants.

//     POST Route (/):
//         Extracting Data: Extracts the relevant participant data from the request body.
//         Database Interaction: Calls addParticipant to store the data.
//         Response: Responds with a status of 200 if successful, otherwise responds with 500 in case of errors.

//     GET Route (/):
//         Database Interaction: Calls getParticipants to fetch all participant data.
//         Response: Responds with a JSON array containing the participants, or with an error if there's a problem.

//     Export:
//         The router is exported to be integrated into the main server file (server.js) under the /participants route.