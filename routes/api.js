const express = require('express');
const router = express.Router();
const { getActivityLog } = require('../database'); // Adjust the path as needed

// Endpoint to fetch activity log data
router.get('/routes/api', async (req, res) => {
    try {
        console.log("Fetching activity log...");
        const activityLog = await getActivityLog(); // Calls the getActivityLog function
        console.log("Activity log fetched successfully.");
        res.json(activityLog);
    } catch (error) {
        console.error('Error fetching activity log:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

