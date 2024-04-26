const mongoose = require('mongoose');
const DB = require('./DB');
const Run = require('../Server/models/Run');

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/socialRunnersPlatform';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const runs = [
  {
    stopsCoordinate: [],
    startLocationCoordinate: { latitude: 33.4484, longitude: -112.0740 },
    endLocationCoordinate: { latitude: 33.4658, longitude: -112.0773 },
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
    startLocationCoordinate: { latitude: 37.7749, longitude: -122.4194 },
    endLocationCoordinate: { latitude: 37.8044, longitude: -122.2711 },
    signUps: [],
    length: 8,
    totalTime: 70,
    date: new Date('2024-06-20'),
    startTime: '07:15 AM',
    startLocation: 'San Francisco, CA',
    endLocation: 'Golden Gate Bridge',
    pace: 8.75,
    runType: 'point to point',
    completedBy: [],
    experienceLevel: 'Intermediate'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { latitude: 32.7157, longitude: -117.1611 },
    endLocationCoordinate: { latitude: 32.7105, longitude: -117.1675 },
    signUps: [],
    length: 7,
    totalTime: 60,
    date: new Date('2024-06-25'),
    startTime: '06:45 AM',
    startLocation: 'San Diego, CA',
    endLocation: 'Balboa Park',
    pace: 8.57,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Intermediate'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { latitude: 42.3601, longitude: -71.0589 },
    endLocationCoordinate: { latitude: 42.3662, longitude: -71.0621 },
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
    startLocationCoordinate: { latitude: 38.9072, longitude: -77.0369 },
    endLocationCoordinate: { latitude: 38.8951, longitude: -77.0364 },
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
    startLocationCoordinate: { latitude: 41.8781, longitude: -87.6298 },
    endLocationCoordinate: { latitude: 41.8919, longitude: -87.6115 },
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
    startLocationCoordinate: { latitude: 29.7604, longitude: -95.3698 },
    endLocationCoordinate: { latitude: 29.7526, longitude: -95.3524 },
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
    startLocationCoordinate: { latitude: 47.6062, longitude: -122.3321 },
    endLocationCoordinate: { latitude: 47.6153, longitude: -122.2008 },
    signUps: [],
    length: 10,
    totalTime: 85,
    date: new Date('2024-07-20'),
    startTime: '08:00 AM',
    startLocation: 'Seattle, WA',
    endLocation: 'Gas Works Park',
    pace: 8.5,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Intermediate'
  },
  {
    stopsCoordinate: [],
    startLocationCoordinate: { latitude: 40.7128, longitude: -74.006 },
    endLocationCoordinate: { latitude: 40.7459, longitude: -74.026 },
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
    startLocationCoordinate: { latitude: 34.0522, longitude: -118.2437 },
    endLocationCoordinate: { latitude: 34.0639, longitude: -118.357 },
    signUps: [],
    length: 7,
    totalTime: 60,
    date: new Date('2024-07-30'),
    startTime: '06:45 AM',
    startLocation: 'Los Angeles, CA',
    endLocation: 'Echo Park Lake',
    pace: 8.57,
    runType: 'loop',
    completedBy: [],
    experienceLevel: 'Intermediate'
  }
];

try {
  const insertedRuns = Run.insertMany(runs);
  console.log(`${insertedRuns.length} new runs added successfully.`);
} catch (error) {
  console.error('Error adding new runs:', error);
} finally {
  mongoose.disconnect();
}

