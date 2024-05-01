const express = require('express');
const cors = require('cors');
const { getActivityLog } = require('../database'); // Import database module
const router = express.Router();

// Define CORS options
const corsOptions = {
  origin: 'https://db-piper64-do-user-13917218-0.c.db.ondigitalocean.com',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};

// Use CORS middleware with the specified options
router.use(cors(corsOptions));

//Endpoint to fetch activity log data
router.get('/api/activity-log', async (req, res) => {
    try {
        console.log("Fetching activity log...");
        const activityLog = await getActivityLog(); // This line calls the getActivityLog function
        console.log("Activity log fetched successfully.");
        res.json(activityLog);
    } catch (error) {
        console.error('Error fetching activity log:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
