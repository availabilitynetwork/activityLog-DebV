const express = require('express');
const router = express.Router();

// Route to fetch activity log data
router.get('./', async (req, res) => {
    try {
        const activityLog = await getActivityLog();
        res.json(activityLog);
    } catch (error) {
        console.error('Error fetching activity log:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
