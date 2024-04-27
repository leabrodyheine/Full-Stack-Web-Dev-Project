const mongoose = require('mongoose');
const DB = require('./DB');
const Run = require('./models/Run');
const User = require('./models/Users');
const Stats = require('./models/Stats');


const mongoURI = 'mongodb://localhost:27017/socialRunnersPlatform';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const runs = [
  {
    stopsCoordinate: [],
    startLocationCoordinate: { type: "Point", coordinates: [-112.0740, 33.4484] },
    endLocationCoordinate: { type: "Point", coordinates: [-112.0773, 33.4658] },
    signUps: [],
    length: 6,
    totalTime: 55,
    date: new Date('2024-06-15'),
    startTime: '06:30 AM',
    startLocation: 'Phoenix, AZ',
    endLocation: 'Camelback Mountain',
    pace: 9.17,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Advanced'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { type: "Point", coordinates: [-71.0589, 42.3601] },
    endLocationCoordinate: { type: "Point", coordinates: [-71.0621, 42.3662] },
    signUps: [],
    length: 5,
    totalTime: 45,
    date: new Date('2024-07-01'),
    startTime: '07:30 AM',
    startLocation: 'Boston, MA',
    endLocation: 'Boston Common',
    pace: 9,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Beginner'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { type: "Point", coordinates: [-77.0369, 38.9072] },
    endLocationCoordinate: { type: "Point", coordinates: [-77.0364, 38.8951] },
    signUps: [],
    length: 6,
    totalTime: 50,
    date: new Date('2024-07-05'),
    startTime: '06:45 AM',
    startLocation: 'Washington, D.C.',
    endLocation: 'National Mall',
    pace: 8.33,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Intermediate'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { type: "Point", coordinates: [-87.6298, 41.8781] },
    endLocationCoordinate: { type: "Point", coordinates: [-87.6115, 41.8919] },
    signUps: [],
    length: 8,
    totalTime: 70,
    date: new Date('2024-07-10'),
    startTime: '07:15 AM',
    startLocation: 'Chicago, IL',
    endLocation: 'Navy Pier',
    pace: 8.75,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Intermediate'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { type: "Point", coordinates: [-95.3698, 29.7604] },
    endLocationCoordinate: { type: "Point", coordinates: [-95.3524, 29.7526] },
    signUps: [],
    length: 4,
    totalTime: 40,
    date: new Date('2024-07-15'),
    startTime: '07:30 AM',
    startLocation: 'Houston, TX',
    endLocation: 'Minute Maid Park',
    pace: 10,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Beginner'
  },

  {
    stopsCoordinate: [],
    startLocationCoordinate: { type: "Point", coordinates: [-74.006, 40.7128] },
    endLocationCoordinate: { type: "Point", coordinates: [-74.026, 40.7459] },
    signUps: [],
    length: 8,
    totalTime: 75,
    date: new Date('2024-07-25'),
    startTime: '07:00 AM',
    startLocation: 'New York, NY',
    endLocation: 'Hudson River Park',
    pace: 9.38,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Intermediate'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { type: "Point", coordinates: [-118.4912, 34.0194] },
    endLocationCoordinate: { type: "Point", coordinates: [-118.2417, 34.0522] },
    signUps: [],
    length: 10,
    totalTime: 90,
    date: new Date('2024-08-05'),
    startTime: '05:00 PM',
    startLocation: 'Santa Monica, CA',
    endLocation: 'Griffith Observatory',
    pace: 9,
    runType: 'point to point',
    completedBy: [],
    experienceLevel: 'Intermediate'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { type: "Point", coordinates: [-80.1918, 25.7617] },
    endLocationCoordinate: { type: "Point", coordinates: [-80.1892, 25.7743] },
    signUps: [],
    length: 6,
    totalTime: 45,
    date: new Date('2024-08-20'),
    startTime: '07:00 PM',
    startLocation: 'Miami, FL',
    endLocation: 'Bayfront Park',
    pace: 7.5,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Intermediate'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { type: "Point", coordinates: [-118.3276, 34.0900] },
    endLocationCoordinate: { type: "Point", coordinates: [-118.3526, 34.1016] },
    signUps: [],
    length: 5,
    totalTime: 40,
    date: new Date('2024-08-30'),
    startTime: '06:45 PM',
    startLocation: 'Beverly Hills, CA',
    endLocation: 'Rodeo Drive',
    pace: 8,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Beginner'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { type: "Point", coordinates: [-97.7431, 30.2672] },
    endLocationCoordinate: { type: "Point", coordinates: [-97.7436, 30.2741] },
    signUps: [],
    length: 4,
    totalTime: 30,
    date: new Date('2024-09-05'),
    startTime: '06:30 PM',
    startLocation: 'Austin, TX',
    endLocation: 'Lady Bird Lake',
    pace: 7.5,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Beginner'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { type: "Point", coordinates: [-71.0636, 42.3612] },
    endLocationCoordinate: { type: "Point", coordinates: [-71.0716, 42.3537] },
    signUps: [],
    length: 5,
    totalTime: 45,
    date: new Date('2024-07-01'),
    startTime: '07:30 AM',
    startLocation: 'Boston, MA',
    endLocation: 'Boston Public Garden',
    pace: 7,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Expert'
  },
  {
    stopsCoordinate: [
      { latitude: 37.7760, longitude: -122.4218, description: "First stop" },
      { latitude: 37.7799, longitude: -122.4231, description: "Second stop" }
    ],
    startLocationCoordinate: { type: "Point", coordinates: [-122.4194, 37.7749] },
    endLocationCoordinate: { type: "Point", coordinates: [-122.4295, 37.7966] },
    signUps: [],
    length: 10,
    totalTime: 75,
    date: new Date('2024-09-22'),
    startTime: '07:30 PM',
    startLocation: 'San Francisco, CA',
    endLocation: 'Lands End',
    pace: 7.5,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Expert'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { type: "Point", coordinates: [-112.0740, 33.4484] },
    endLocationCoordinate: { type: "Point", coordinates: [-112.0773, 33.4658] },
    signUps: [],
    length: 6,
    totalTime: 55,
    date: new Date('2024-06-15'),
    startTime: '06:30 AM',
    startLocation: 'Phoenix, AZ',
    endLocation: 'Camelback Mountain',
    pace: 9.17,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Expert'
  },
  {
    stopsCoordinate: [
      { latitude: 37.7760, longitude: -122.4218, description: "First stop" },
      { latitude: 37.7799, longitude: -122.4231, description: "Second stop" }
    ],
    startLocationCoordinate: { type: "Point", coordinates: [-122.4194, 37.7749] },
    endLocationCoordinate: { type: "Point", coordinates: [-122.4295, 37.7966] },
    signUps: [],
    length: 10,
    totalTime: 75,
    date: new Date('2024-09-23'),
    startTime: '07:30 PM',
    startLocation: 'San Francisco, CA',
    endLocation: 'Lands End',
    pace: 7.5,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Advanced'
  },
  {
    stopsCoordinate: [
      { latitude: 37.7790, longitude: -122.4200, description: "First stop" },
      { latitude: 37.7780, longitude: -122.4220, description: "Second stop" }
    ],
    startLocationCoordinate: { type: "Point", coordinates: [-122.4150, 37.7730] },
    endLocationCoordinate: { type: "Point", coordinates: [-122.4250, 37.7970] },
    signUps: [],
    length: 8,
    totalTime: 60,
    date: new Date('2024-09-24'),
    startTime: '08:00 PM',
    startLocation: 'San Francisco, CA',
    endLocation: 'Golden Gate Bridge',
    pace: 7.5,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Advanced'
  },
  {
    stopsCoordinate: [
      { latitude: 37.7740, longitude: -122.4220, description: "First stop" },
      { latitude: 37.7770, longitude: -122.4240, description: "Second stop" }
    ],
    startLocationCoordinate: { type: "Point", coordinates: [-122.4170, 37.7750] },
    endLocationCoordinate: { type: "Point", coordinates: [-122.4270, 37.7980] },
    signUps: [],
    length: 12,
    totalTime: 90,
    date: new Date('2024-09-25'),
    startTime: '06:30 PM',
    startLocation: 'San Francisco, CA',
    endLocation: 'Golden Gate Park',
    pace: 7.5,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Advanced'
  }
];



const users = [
  { username: "Lucy", password: "hi" }
];

const stats = [
  {
    userId: null,  // Will be set after the user is created
    totalDistance: 50,
    totalTime: 250,
    runs: 6,
    paceData: [
      { date: new Date('2024-06-01'), pace: 8.5 },
      { date: new Date('2024-06-15'), pace: 9.0 },
      { date: new Date('2024-06-30'), pace: 8.7 }
    ]
  }
];

async function initializeDatabase() {
  try {
    // Insert runs
    const insertedRuns = await Run.insertMany(runs);
    console.log(`${insertedRuns.length} new runs added successfully.`);

    // Insert user and use its ID for stats
    const insertedUsers = await User.insertMany(users);
    console.log(`${insertedUsers.length} new user(s) added successfully.`);

    // Update stats with userId from the newly inserted user
    stats[0].userId = insertedUsers[0]._id;
    const insertedStats = await Stats.insertMany(stats);
    console.log(`${insertedStats.length} new stats record(s) added successfully.`);
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    mongoose.disconnect();
  }
}

initializeDatabase();
