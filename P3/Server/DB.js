// Require Mongoose module to interact with MongoDB
const mongoose = require('mongoose');

/**
 * Asynchronously connects to MongoDB.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using Mongoose
        await mongoose.connect('mongodb://localhost:27017/socialRunnersPlatform', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

// Export the connect function for other files to use
module.exports = connectDB;
