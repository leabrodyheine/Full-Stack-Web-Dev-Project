const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

async function geocodeLocation(locationString) {
    const accessToken = 'pk.eyJ1IjoibGJoNSIsImEiOiJjbHU1bzBtc3IwdHljMmlueGc2aWQwamIxIn0.KFx5qzUkJz9ubiQ41wxYpg';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationString)}.json?access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.features.length > 0) {
            return data.features[0].center; // Returns [longitude, latitude]
        } else {
            throw new Error('Location not found');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}
module.exports = router;
