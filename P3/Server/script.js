const mongoose = require('mongoose');
const Run = require('../Server/models/Run');  // Update the path to your Run model

const mongoURI = 'mongodb://localhost:27017/socialRunnersPlatform';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

async function updateOrDeleteRuns() {
    const runs = await Run.find();

    for (let run of runs) {
        if (!run.startLocationCoordinate || !run.endLocationCoordinate) {
            // If required fields are missing, delete the run
            await Run.deleteOne({ _id: run._id });
            console.log(`Deleted run ${run._id} due to missing required fields.`);
        } else {
            // If all required fields are present, compute and update the experience level
            const experienceLevel = computeExperienceLevel(run.length, run.totalTime);
            if (run.experienceLevel !== experienceLevel) {
                run.experienceLevel = experienceLevel;
                await run.save();
                console.log(`Updated run ${run._id} with experience level ${experienceLevel}`);
            }
        }
    }

    mongoose.disconnect();
    console.log('Completed updating or deleting runs.');
}

function computeExperienceLevel(distance, totalTime) {
    const speed = distance / (totalTime / 60); // speed in miles per hour

    if (speed > 6) return 'Expert';
    else if (speed > 4.5) return 'Advanced';
    else if (speed > 3) return 'Intermediate';
    else return 'Beginner';
}

updateOrDeleteRuns();
