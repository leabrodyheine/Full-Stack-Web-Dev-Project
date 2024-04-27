// Require necessary NPM modules
const express = require('express');
const connectDB = require('./DB');
const expressBasicAuth = require('express-basic-auth')
const app = express();
const path = require('path');

// Establish a connection to the database
connectDB();

// Middleware to set the correct MIME type for JavaScript files
app.use((req, res, next) => {
    if (req.path.endsWith('.js') || req.path.endsWith('.mjs')) {
        res.type('application/javascript');
    }
    next();
});

// Middleware to serve static files from the 'Client' directory
app.use(express.static(path.join(__dirname, '..', 'Client')));

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Routing middleware for different API endpoints
app.use('/api/users', require('./Routes/UserRoutes.js'));
app.use('/api/stats', require('./Routes/StatsRoutes.js'));
app.use('/api/runs', require('./Routes/RunsRoutes.js'));

// Middleware to log the request URL for debugging
app.use((req, res, next) => {
    console.log('Request URL:', req.originalUrl); 
    next();
});

// Set the port for the server to listen on
const PORT = process.env.PORT || 5030;

// Route for the home page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Client', 'index.html'));
});
// Route for serving the StyleSheet.css
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Client', 'StyleSheet.css'));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});