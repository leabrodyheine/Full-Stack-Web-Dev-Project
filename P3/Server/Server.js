// Simplify global variables
const express = require('express');
const connectDB = require('./DB');
const expressBasicAuth = require('express-basic-auth')
const app = express();
// Connect to database
connectDB();

// Apply middleware
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static("."));

// Define Routes
app.use('/api/users', require('./Routes/UserRoutes.js'));
app.use('/api/stats', require('./Routes/StatsRoutes.js'));
app.use('/api/runs', require('./Routes/RunsRoutes.js'));

const PORT = process.env.PORT || 5030;

// After all other route definitions
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});