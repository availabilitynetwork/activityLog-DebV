const express = require('express');
const router = express.Router();
const { getActivityLog } = require('./database'); // Import the getActivityLog function from your database module

// Route to fetch activity log data
router.get('/', async (req, res) => {
    try {
        const activityLog = await getActivityLog();
        res.json(activityLog);
    } catch (error) {
        console.error('Error fetching activity log:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;



