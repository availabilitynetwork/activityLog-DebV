const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const apiRoutes = require('./routes/api.js'); // Make sure this path matches the location of your apiRouter file

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

// API Routes
app.use('/api', apiRoutes); // Mount API router at '/api' prefix

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
const port = process.env.PORT||3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
