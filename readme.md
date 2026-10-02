# Social Runners Platform

A completed full-stack coursework project for organizing community runs. Users can create an account, browse and filter scheduled runs, register for an event, record a completed run, and view running statistics. The browser client is served by an Express API backed by MongoDB.

## Features

- Account registration and login
- Run creation with route, date, distance, pace, and experience level
- Event filtering, sorting, registration, and completion tracking
- User statistics and charts
- Map-based route creation

## Technology

Vue 2 · Node.js · Express · MongoDB/Mongoose · Chart.js · Mapbox GL JS

## Run locally

Prerequisites: Node.js 18 and a local MongoDB server.

```bash
npm install
node P3/Server/DBScript.js
node P3/Server/Server.js
```

Open <http://localhost:5030>. The seed script populates the `socialRunnersPlatform` database with sample users, runs, and statistics. The application also uses browser-loaded Mapbox resources, so map features require an internet connection.

## Structure

- `P3/Client/` contains the Vue client, styles, and static assets.
- `P3/Server/Server.js` serves the client and mounts the REST API.
- `P3/Server/Routes/` contains user, run, and statistics endpoints.
- `P3/Server/models/` contains the Mongoose schemas.
- `P3/Server/DBScript.js` loads the sample dataset.

## Project status

This is a completed academic project preserved as a portfolio example. It is not a hosted production service.
