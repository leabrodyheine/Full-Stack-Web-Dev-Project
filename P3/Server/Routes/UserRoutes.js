const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');
const bcrypt = require('bcrypt');
const expressBasicAuth = require('express-basic-auth');

// Custom authorizer function for express-basic-auth
const customAuthorizer = async (username, password, cb) => {
    try {
        const user = await User.findOne({ username });

        if (!user) {
            // User not found
            return cb(null, false);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Passwords match
            return cb(null, true);
        } else {
            // Passwords do not match
            return cb(null, false);
        }
    } catch (err) {
        return cb(err);
    }
};

// Basic Authentication middleware setup
const basicAuthMiddleware = expressBasicAuth({
    authorizer: customAuthorizer,
    authorizeAsync: true,
    unauthorizedResponse: () => 'Unauthorized'
});

// Login route using express-basic-auth
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).send('Login failed'); // User not found
        }

        if (password === user.password) {
            res.status(200).json({ msg: `Welcome, ${username}!` });
        } else {
            return res.status(401).send('Login failed'); // Password does not match
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ username });
    if (user) {
        return res.status(400).json({ msg: 'User already exists' });
    }

    // Create and store the new user
    user = new User({
        username,
        password
    });

    await user.save();
    console.log(user)
    res.status(201).json({ msg: 'User registered successfully' });
});



// GET api/users - Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error Getting Users');
    }
});

// GET api/users/:id - Get a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error Retrieving User');
    }
});

// PUT api/users/:id - Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const { username, password } = req.body; // Include any other user fields you want to update

        // Construct user update object
        const userUpdate = { username, password }; // Hash password if changed, handle this in your User model

        // Find the user by ID and update
        let user = await User.findByIdAndUpdate(req.params.id, userUpdate, { new: true });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error Updating User');
    }
});


// DELETE api/users/:id - Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.remove();
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error Deleting User');
    }
});

module.exports = router;
