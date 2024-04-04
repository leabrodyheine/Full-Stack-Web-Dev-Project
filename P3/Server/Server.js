const express = require('express');
const connectDB = require('./DB');
const expressBasicAuth = require('express-basic-auth')
const app = express();
const path = require('path');
const geocodeRoutes = require('../Server/GeoCoding.js'); // Update the path

// Connect to database
connectDB();

// Apply middleware
app.use(express.json());
// app.use(geocodeRoutes);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, '..', 'Client')));

// Define Routes
app.use('/api/users', require('./Routes/UserRoutes.js'));
app.use('/api/stats', require('./Routes/StatsRoutes.js'));
app.use('/api/runs', require('./Routes/RunsRoutes.js'));

const PORT = process.env.PORT || 5030;

// // After all other route definitions
// app.use((req, res, next) => {
//     res.status(404).json({ error: 'Not Found' });
// });

// START HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Client', 'index.html'));
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});