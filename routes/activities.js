// activity.js
const express = require('express');
const router = express.Router();
const { addActivity } = require('../database'); // Adjust import path as necessary

// POST route to add a new activity
router.post('/', async (req, res) => {
    const { selectParticipant, activityType, activityDescription, caseNotes, billableHours, activityDate } = req.body;

    try {
        // Pass all required data, including activityType
        await addActivity(selectParticipant, activityType, activityDescription, caseNotes, billableHours, activityDate);
        res.status(201).json({ message: 'Activity added successfully' });
    } catch (error) {
        console.error('Error adding activity:', error);
        res.status(500).json({ error: 'Failed to add activity' });
    }
});

module.exports = router;

