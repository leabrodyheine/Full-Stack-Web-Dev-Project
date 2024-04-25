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
        stopsCoordinate: [
          { latitude: 40.7128, longitude: -74.0060, description: "Stop 1" },
          { latitude: 40.7127, longitude: -74.0059, description: "Stop 2" }
        ],
        startLocationCoordinate: { latitude: 40.7128, longitude: -74.0060 },
        endLocationCoordinate: { latitude: 40.7138, longitude: -74.0061 },
        signUps: [],
        length: 5,
        totalTime: 50,
        date: new Date(),
        startTime: "07:00 AM",
        startLocation: "Central Park",
        endLocation: "Riverside Park",
        pace: 10,
        runType: "loop",
        completedBy: []
      },
      {
        stopsCoordinate: [
          { latitude: 34.0522, longitude: -118.2437, description: "LA Start" }
        ],
        startLocationCoordinate: { latitude: 34.0522, longitude: -118.2437 },
        endLocationCoordinate: { latitude: 34.0522, longitude: -118.2437 },
        signUps: [],
        length: 10,
        totalTime: 100,
        date: new Date(),
        startTime: "09:00 AM",
        startLocation: "Downtown LA",
        endLocation: "Downtown LA",
        pace: 10,
        runType: "out and back",
        completedBy: []
      },
    {
        stopsCoordinate: [],
        startLocationCoordinate: { latitude: 34.0522, longitude: -118.2437 },
        endLocationCoordinate: { latitude: 34.0833, longitude: -118.3506 },
        signUps: [],
        length: 4,
        totalTime: 40,
        date: new Date('2024-05-01'),
        startTime: '07:00 AM',
        startLocation: 'Los Angeles, CA',
        endLocation: 'Griffith Park',
        pace: 10,
        runType: 'loop',
        completedBy: []
    },
    {
        stopsCoordinate: [],
        startLocationCoordinate: { latitude: 40.7128, longitude: -74.006 },
        endLocationCoordinate: { latitude: 40.7829, longitude: -73.9654 },
        signUps: [],
        length: 5,
        totalTime: 45,
        date: new Date('2024-05-05'),
        startTime: '06:30 AM',
        startLocation: 'New York, NY',
        endLocation: 'Central Park',
        pace: 9,
        runType: 'loop',
        completedBy: []
    },
    {
        stopsCoordinate: [],
        startLocationCoordinate: { latitude: 47.6062, longitude: -122.3321 },
        endLocationCoordinate: { latitude: 47.6205, longitude: -122.3493 },
        signUps: [],
        length: 6,
        totalTime: 50,
        date: new Date('2024-05-10'),
        startTime: '06:15 AM',
        startLocation: 'Seattle, WA',
        endLocation: 'Green Lake Park',
        pace: 8.33,
        runType: 'loop',
        completedBy: []
    },
    {
        stopsCoordinate: [],
        startLocationCoordinate: { latitude: 41.8781, longitude: -87.6298 },
        endLocationCoordinate: { latitude: 41.9101, longitude: -87.6397 },
        signUps: [],
        length: 3,
        totalTime: 35,
        date: new Date('2024-05-15'),
        startTime: '07:30 AM',
        startLocation: 'Chicago, IL',
        endLocation: 'Millennium Park',
        pace: 11.67,
        runType: 'loop',
        completedBy: []
    },
    {
        stopsCoordinate: [],
        startLocationCoordinate: { latitude: 29.7604, longitude: -95.3698 },
        endLocationCoordinate: { latitude: 29.7329, longitude: -95.4186 },
        signUps: [],
        length: 5,
        totalTime: 45,
        date: new Date('2024-05-20'),
        startTime: '06:45 AM',
        startLocation: 'Houston, TX',
        endLocation: 'Buffalo Bayou Park',
        pace: 9,
        runType: 'loop',
        completedBy: []
    },
    {
        stopsCoordinate: [],
        startLocationCoordinate: { latitude: 33.749, longitude: -84.388 },
        endLocationCoordinate: { latitude: 33.786, longitude: -84.372 },
        signUps: [],
        length: 7,
        totalTime: 60,
        date: new Date('2024-05-25'),
        startTime: '7:450 AM',
        startLocation: 'Atlanta, GA',
        endLocation: 'Piedmont Park',
        pace: 8.57,
        runType: 'loop',
        completedBy: []
    },
    {
        stopsCoordinate: [],
        startLocationCoordinate: { latitude: 34.0522, longitude: -118.2437 },
        endLocationCoordinate: { latitude: 34.0116, longitude: -118.494 },
        signUps: [],
        length: 6,
        totalTime: 50,
        date: new Date('2024-06-01'),
        startTime: '11:30 AM',
        startLocation: 'Los Angeles, CA',
        endLocation: 'Santa Monica Beach',
        pace: 8.33,
        runType: 'out and back',
        completedBy: []
      },
      {
        stopsCoordinate: [],
        startLocationCoordinate: { latitude: 40.7128, longitude: -74.006 },
        endLocationCoordinate: { latitude: 40.7683, longitude: -73.964 },
        signUps: [],
        length: 8,
        totalTime: 70,
        date: new Date('2024-06-05'),
        startTime: '07:00 AM',
        startLocation: 'New York, NY',
        endLocation: 'East River Park',
        pace: 8.75,
        runType: 'out and back',
        completedBy: []
      },
      {
        stopsCoordinate: [],
        startLocationCoordinate: { latitude: 37.7749, longitude: -122.4194 },
        endLocationCoordinate: { latitude: 37.7964, longitude: -122.4058 },
        signUps: [],
        length: 10,
        totalTime: 80,
        date: new Date('2024-06-10'),
        startTime: '10:15 AM',
        startLocation: 'San Francisco, CA',
        endLocation: 'Golden Gate Park',
        pace: 8,
        runType: 'point to point',
        completedBy: []
      },
];

const intermediateRuns = Array.from({ length: 5 }).map((_, i) => ({
  stopsCoordinate: [],
  startLocationCoordinate: { latitude: 34.0522, longitude: -118.2437 + i * 0.01 },
  endLocationCoordinate: { latitude: 34.0522, longitude: -118.2437 + i * 0.01 },
  signUps: [],
  length: 5,
  totalTime: 60 + i * 2, 
  date: new Date(),
  startTime: "09:00 AM",
  startLocation: "Downtown LA",
  endLocation: "Downtown LA",
  pace: 12 - i * 0.4,
  runType: "loop",
  completedBy: [],
  experienceLevel: "Intermediate"
}));

const beginnerRuns = Array.from({ length: 5 }).map((_, i) => ({
  stopsCoordinate: [],
  startLocationCoordinate: { latitude: 40.7128, longitude: -74.006 + i * 0.01 },
  endLocationCoordinate: { latitude: 40.7128, longitude: -74.006 + i * 0.01 },
  signUps: [],
  length: 5,
  totalTime: 70 + i * 5,
  date: new Date(),
  startTime: "07:00 AM",
  startLocation: "Central Park",
  endLocation: "Central Park",
  pace: 14 + i * 0.5,
  runType: "loop",
  completedBy: [],
  experienceLevel: "Beginner"
}));


// Function to insert runs into the database
async function insertRuns() {
    try {
      await Run.insertMany([...intermediateRuns, ...beginnerRuns]);
      console.log('Runs have been added!');
    } catch (error) {
      console.error('Error inserting runs:', error);
    } finally {
      mongoose.disconnect();
    }
  }
  
  insertRuns();