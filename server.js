// Importing core modules and middleware packages
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./database'); // Assuming your database file is named 'database.js'
const updateQueryBillableHours = require('./routes/updateQueryBillableHours');
// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();

// Applying middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors());

// Set up routes
app.use('/participants', require('./routes/participants'));
app.use('/activities', require('./routes/activities'));
app.use('/activity_type', require('./routes/activity_type'));
app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));
app.use('/updateQueryBillableHours', updateQueryBillableHours);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server only after the database connection is confirmed
db.testDatabaseConnection()
    .then(() => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to database:', err);
        process.exit(1); // Exit if the database connection fails
    });

// Global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
