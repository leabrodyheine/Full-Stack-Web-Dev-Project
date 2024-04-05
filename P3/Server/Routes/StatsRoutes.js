const express = require('express');
const router = express.Router();

router.get('/user-stats/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const runs = await Run.find({'completedBy.userId': mongoose.Types.ObjectId(userId)});
    let totalDistance = 0;
    let totalTime = 0;
    
    runs.forEach(run => {
      run.completedBy.forEach(completion => {
        if(completion.userId.toString() === userId) {
          totalDistance += completion.distance;
          totalTime += completion.time;
        }
      });
    });

    const averagePace = totalTime / totalDistance;

    res.json({
      totalDistance,
      totalTime,
      averagePace,
      runsCompleted: runs.length
      // Add other stats as needed
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
