const express = require('express');
const router = express.Router();
const { addAuthorization, getParticipants } = require('../database'); // Import functions as needed

// Endpoint to add an authorization
router.post('/', async (req, res) => {
    const { selectParticipantForAuth, authNumber, authBillableHours, authBeginDate, authEndDate, description } = req.body;

    try {
        // Add the authorization to the database
        await addAuthorization(selectParticipantForAuth, authNumber, authBillableHours, authBeginDate, authEndDate, description);
        res.status(201).send('Authorization added successfully');
    } catch (error) {
        console.error('Error adding authorization:', error);
        res.status(500).send('Failed to add authorization');
    }
});

// Endpoint to get all participants (to populate the dropdown)
router.get('/participants', async (req, res) => {
    try {
        const participants = await getParticipants(); // Retrieve the participants
        res.json(participants); // Send them as JSON
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ message: 'Error fetching participants' });
    }
});

module.exports = router;
