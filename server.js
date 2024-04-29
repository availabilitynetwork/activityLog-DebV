const express = require('express');
const apiRouter = require('./apiRouter');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

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

// Mount the router at /api
app.use('/api', apiRouter);

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
