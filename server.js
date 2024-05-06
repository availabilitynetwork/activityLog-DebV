// Importing core modules and middleware packages
const express = require('express'); // Express web framework for building APIs
const path = require('path'); // Path module to handle file and directory paths
const dotenv = require('dotenv'); // dotenv to manage environment variables
const morgan = require('morgan'); // Morgan to log HTTP requests
const cors = require('cors'); // CORS middleware to handle cross-origin requests

// Importing custom route modules
const apiRoutes = require('./routes/api.js'); // General API route (ensure path is correct)
const participantsRoutes = require('./routes/participants.js'); // Routes to manage participants
const activityRoutes = require('./routes/activities.js'); // Routes to manage activities
const typeRoutes = require('./routes/activity_type.js'); // Routes to manage activity types
const authorizationRoutes = require('./routes/auth.js');


// Load environment variables from `.env` file into process.env
dotenv.config(); 

// Initialize Express application
const app = express();

// Applying middlewares

// Morgan middleware for logging HTTP requests, useful for debugging
app.use(morgan('dev'));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded bodies, useful for form submissions
app.use(express.urlencoded({ extended: true }));

// CORS configuration to allow or restrict cross-origin requests
const corsOptions = {
    origin: '*', // Allow requests from any domain, can be restricted as needed
    methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization' // Allowed headers
};
app.use(cors(corsOptions)); // Apply CORS with configured options

// Route-specific middlewares

// Participants routes
app.use('/participants', (req, res, next) => {
    console.log('participants route hit'); // Log route usage
    next(); // Proceed to the next middleware in the chain
}, participantsRoutes);

// Activities routes
app.use('/activities', (req, res, next) => {
    console.log('Activities route hit'); // Log route usage
    next(); // Proceed to the next middleware
}, activityRoutes);

// Activity types routes
app.use('/activity_type', (req, res, next) => {
    console.log('activity_type route hit'); // Log route usage
    next(); // Proceed to the next middleware
}, typeRoutes);

// General API routes (could include a collection of smaller endpoints)
app.use('/api', (req, res, next) => {
    console.log('API route hit'); // Log route usage
    next(); // Proceed to the next middleware
}, apiRoutes);

 
app.use('/activity_type/description', (req, res, next) => {
    console.log('activity_type/description route hit'); // Log route usage
    next(); // Proceed to the next middleware
}, apiRoutes);

app.use('/auth', (req, res, next) => {
    console.log('auth route hit'); // Log route usage
    next(); // Proceed to the next middleware
}, authorizationRoutes);

// Static file serving middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the `public` directory

const http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, world!\n');
});

// Set the server timeout to 10 seconds (10,000 ms)
server.setTimeout(10000, (socket) => {
  // This callback is invoked if the timeout is reached
  socket.end('Request timeout. Closing connection.\n');
});

// Global Error Handling

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason); // Log details of the unhandled rejection
    // Additional error logging or alerting can be implemented here
});

// General error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(500).send('Something broke!'); // Respond with a 500 status and a generic message
});

// Start the server
const port = process.env.PORT || 3000; // Get the port from environment variables or default to 3000
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`); // Confirm server startup
});


/////////////////////////////////////////////////////////////////////////////////////////
// Explanation:

//     Import Statements:
//         Each imported package is used to set up and configure the application. Morgan is for logging, CORS handles cross-origin requests, and path helps to resolve file paths.

//     Routes:
//         Each set of routes corresponds to a different section of your application, like participants, activities, etc. They are grouped logically and routed through their respective files.

//     Middlewares:
//         Morgan logs requests for debugging, Express parsers handle incoming data, and custom logging functions are placed before each route.

//     Error Handling:
//         The global error handling middleware captures unhandled errors and logs them before responding.
//         The unhandledRejection listener ensures that the server gracefully handles promise rejections.

// This structure keeps the application modular, organized, and easy to extend as new routes or features are added.