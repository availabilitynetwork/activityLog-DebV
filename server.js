const express = require('express');

const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan'); // Import morgan middleware
const apiRouter = require('./api'); // Import the API router from api.js

dotenv.config();
const app = express();

// Use morgan middleware to log requests
app.use(morgan('dev'));

// Middleware
// Apply middleware for parsing JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mount the API router
app.use('/api', apiRouter);

const port = process.env.PORT || 5500;
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// Error handling for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});