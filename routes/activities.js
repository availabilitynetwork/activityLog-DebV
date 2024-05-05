// Import necessary modules
const express = require('express'); // Import Express for routing
const router = express.Router(); // Create an Express router instance
const { addActivity, findOrAddActivityType } = require('../database'); // Import functions for adding activities and finding/adding activity types

// Define a POST route to handle adding new activities
router.post('/', async (req, res) => {
    // Extract data from the request body
    const {
        selectParticipant,        // ID of the selected participant
        activity_type_id,         // Selected or custom activity type
        customActivityType,       // Custom type name if "Custom" is chosen
        activityDescription,      // Description of the activity
        caseNotes,                // Notes related to the activity
        billableHours,            // Number of billable hours
        activityDate              // Date of the activity
    } = req.body;

    // Default the final activity type to the provided ID
    let finalActivityTypeId = activity_type_id;

    try {
        // If "Custom" is selected and a new activity type name is provided
        if (activity_type_id === 'Custom' && customActivityType) {
            // Find or add the custom activity type to the database
            finalActivityTypeId = await findOrAddActivityType(customActivityType);
        }

        // Validate that the final activity type ID is a valid number
        if (!finalActivityTypeId || isNaN(finalActivityTypeId)) {
            return res.status(400).json({ error: 'Invalid or missing activity type' });
        }

        // Insert the new activity record into the database using the final activity type ID
        await addActivity(
            selectParticipant,
            finalActivityTypeId,
            activityDescription,
            caseNotes,
            billableHours,
            activityDate
        );

        // Respond with success if the addition was successful
        res.status(201).json({ message: 'Activity added successfully' });
    } catch (error) {
        // Log any errors that occurred and respond with a 500 status code
        console.error('Error adding activity:', error);
        res.status(500).json({ error: 'Failed to add activity' });
    }
});

// Export the router for use in other files (like `server.js`)
module.exports = router;

// Explanation:

//     Importing Modules:
//         Express: Required for routing.
//         Database Functions: addActivity and findOrAddActivityType are imported from database.js.

//     Router Setup:
//         A POST route is defined to handle the submission of new activity data.

//     POST Route (/):
//         Data Extraction: Extracts all required data from the request body including details about the participant, activity type, description, etc.
//         Custom Activity Type Handling: If the activity_type_id is marked as 'Custom', it checks if a customActivityType is provided and processes it.
//         Validation: Ensures that a valid activity_type_id is obtained, either directly or through custom type handling.
//         Database Interaction: Calls addActivity with the necessary parameters to add the activity to the database.
//         Response: Returns a success message upon successful addition or an error if the operation fails.

//     Error Handling:
//         If there is any error during the operation, it logs the error and sends an appropriate error response.

//     Export:
//         The router is exported for integration into the main server, allowing it to handle requests at its route path defined in server.js.