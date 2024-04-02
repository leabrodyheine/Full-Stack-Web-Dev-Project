const express = require('express');
const connectDB = require('./DB');
// Connect to database
connectDB();

const app = express();

// Apply middleware
app.use(express.json());

// Define Routes
app.use('/api/users', require('./Routes/UsersRoutes'));
app.use('/api/stats', require('./Routes/StatsRoutes'));
app.use('/api/runs', require('./Routes/RunsRoutes'));

const PORT = process.env.PORT || 5030;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
