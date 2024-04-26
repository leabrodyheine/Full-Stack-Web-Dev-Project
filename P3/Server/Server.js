const express = require('express');
const connectDB = require('./DB');
const expressBasicAuth = require('express-basic-auth')
const app = express();
const path = require('path');

// Connect to database
connectDB();

// Middleware to set the correct MIME type for JavaScript modules
app.use((req, res, next) => {
    if (req.path.endsWith('.js') || req.path.endsWith('.mjs')) {
        res.type('application/javascript');
    }
    next();
});

// Config
app.use(express.static(path.join(__dirname, '..', 'Client')));

// Apply middleware
app.use(express.json());


app.use('/api/users', require('./Routes/UserRoutes.js'));
app.use('/api/stats', require('./Routes/StatsRoutes.js'));
app.use('/api/runs', require('./Routes/RunsRoutes.js'));
app.use((req, res, next) => {
    console.log('Request URL:', req.originalUrl); 
    next();
});

const PORT = process.env.PORT || 5030;


// START HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Client', 'index.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Client', 'StyleSheet.css'));
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});