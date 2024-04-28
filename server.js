const express = require('express');
const { getActivityLog } = require('/database');
 // Import the getActivityLog function from your database module
const cors = require('cors');
const activityLogRoutes = require('/api/activity-log/activityLogRoutes.js'); // Import the activityLogRoutes

require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

/////////////////////////////////////////////////////// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (["https://sea-turtle-app-2b56e.ondigitalocean.app/", "http://localhost:3000"].indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight across-the-board

app.use(express.json());

app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url} with headers ${JSON.stringify(req.headers)}`);
    next();
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// RESTful API routes///////////////////////////////////////////////////////////////
// 
// Route to fetch activity log data
app.get('/api/activity-log', async (req, res) => {
    try {
        const activityLog = await getActivityLog();
        console.log('Activity Log:', activityLog); // Log the activity log before sending it
        res.json(activityLog);
    } catch (error) {
        console.error('Error fetching activity log:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mount the activityLogRoutes on the /api/activity-log/ path
app.use('/api/activity-log', activityLogRoutes); // Here we mount the activityLogRoutes

app.listen(port, () => console.log(`Server running on port ${port}`));
