// In participants.js
const express = require('express');
const router = express.Router();
const { addParticipant } = require('../database'); // Import the addParticipant function from database.js

// POST route to add a new participant
router.post('/', async (req, res) => {
    // Extract participant data from request body
    const { email, firstName, lastName, phone, registrationDate } = req.body;

    try {
        // Insert participant data into the database
        await addParticipant(email, firstName, lastName, phone, registrationDate);
        // Send a response indicating success
        res.status(200).json({ message: 'Participant added successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error adding participant:', error);
        res.status(500).json({ message: 'Failed to add participant' });
    }
});

// Other endpoints related to participants can be added here if needed

module.exports = router;
