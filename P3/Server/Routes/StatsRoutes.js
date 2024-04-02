const express = require('express');
const router = express.Router();

// @route   GET api/stats
// @desc    Get stats for a user
router.get('/:userId', (req, res) => {
  // Handle GET request for user stats
});

// Additional routes for POST, PUT, DELETE below...

module.exports = router;
