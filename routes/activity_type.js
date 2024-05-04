const express = require('express');
const router = express.Router();
const { addActivityType, getActivityTypes } = require('../database');

// POST route to add a new activity type
router.post('/', async (req, res) => {
    try {
        // Ensure both type_name and activity_desc are retrieved from the request body
        const { type_name, activity_desc } = req.body;

        // Call the database function to add the new activity type
        await addActivityType(type_name, activity_desc);

        res.status(201).json({ message: 'Activity type added successfully' });
    } catch (error) {
        console.error('Error adding activity type:', error);
        res.status(500).json({ error: 'Failed to add activity type' });
    }
});

// GET route to retrieve all activity types
router.get('/', async (req, res) => {
    try {
        // Retrieve all activity types from the database
        const types = await getActivityTypes();

        // Respond with the types in JSON format
        res.json(types);
    } catch (error) {
        console.error('Error fetching activity types:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
