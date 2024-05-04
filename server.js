const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const apiRoutes = require('./routes/api.js'); // Make sure this path matches the location of your apiRouter file
const participantsRoutes = require('./routes/participants.js'); // Import the participants router
const activityRoutes = require('./routes/activities.js');
const typeRoutes = require('./routes/activity_type.js');
dotenv.config(); // Load environment variables from .env file

const app = express();

// Middlewares
app.use(morgan('dev')); // Log requests to the console for debugging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CORS configuration
const corsOptions = {
    origin: '*', // Configure this according to your requirements
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions)); // Enable CORS with the above options
//////////////////////////////////////////////////////////////////
app.use('/participants', (req, res, next) => {
    console.log('participants route hit');
    next();
}, participantsRoutes);

// Middleware to log when the API route is hit
app.use('/activities', (req, res, next) => {
    console.log('Activities route hit');
    next();
}, activityRoutes);

// Middleware to log when the API route is hit
app.use('/activity_type', (req, res, next) => {
    console.log('activity_type route hit');
    next();
}, typeRoutes);


// Middleware to log when the API route is hit
app.use('/api', (req, res, next) => {
    console.log('API route hit');
    next();
}, apiRoutes);


///////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Error handling for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Log the error / reason or handle it as needed
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});

