const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan'); // Import morgan middleware
const { getActivityLog } = require('./database'); // Import database module

dotenv.config();
const app = express();

// Define CORS options
const corsOptions = {
  origin: 'https://db-piper64-do-user-13917218-0.c.db.ondigitalocean.com',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));

// Use morgan middleware to log requests
app.use(morgan('dev'));

//Endpoint to fetch activity log data
app.get('/api/activity-log', async (req, res) => {
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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const port = process.env.PORT || 3000;
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// Error handling for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});