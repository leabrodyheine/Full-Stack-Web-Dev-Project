import { createApp, onMounted, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    setup() {
        const runs = ref([]);
        const showSection = ref('login');
        const map = ref(null); // Reference for the map object

        // Placeholder refs for dynamic map centering
        const startLatitude = ref(null);
        const startLongitude = ref(null);
        const endLatitude = ref(null);
        const endLongitude = ref(null);

        // Example function to update the map view dynamically
        // This function would be called after you have geocoded locations
        function updateMapView(latitude, longitude) {
            if (map.value) {
                map.value.setView([latitude, longitude], 13);
            }
        }

        const fetchRuns = async () => {
            try {
                const response = await fetch('/api/runs');
                if (response.ok) {
                    runs.value = await response.json();
                } else {
                    alert('Failed to fetch runs');
                }
            } catch (error) {
                console.error('Error fetching runs:', error);
            }
        };
        onMounted(() => {
            map.value = L.map('map').setView([startLatitude.value, startLongitude.value], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors',
            }).addTo(map.value);

            // Example: add markers for the start and end locations
            L.marker([startLatitude.value, startLongitude.value]).addTo(map.value)
                .bindPopup('Start Location');
            // Add more markers based on `runs` data if needed
        });

        return {
            runs,
            showSection,
            fetchRuns,
            startLatitude,
            startLongitude,
        }
    },
    data() {
        return {
            username: '',
            password: '',
            eventName: '',
            eventDate: '',
        };
    },
    methods: {
        async login() {
            const credentials = window.btoa(`${this.username}:${this.password}`);
            try {
                const response = await fetch('/api/users/login', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                });
                if (response.ok) {
                    this.showSection = 'eventList';
                } else {
                    alert('Login failed!');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async register() {
            try {
                const response = await fetch('/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: this.username, password: this.password })
                });
                if (response.ok) {
                    this.showSection = 'eventList';
                } else {
                    alert('Registration failed!');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },

        showCreateRun() {
            this.showSection = 'createRun';
        },

        async submitRun() {
            try {
                const startCoords = await this.geocodeLocation(this.startLocation);
                const endCoords = await this.geocodeLocation(this.endLocation);
                if (startCoords && endCoords) {
                    this.updateMapView(startCoords[1], startCoords[0]); // Update the map view to the new location
                }
                const runDetails = {
                    eventName: this.eventName,
                    eventDate: this.eventDate,
                    startTime: this.startTime,
                    runType: this.runType,
                    startLocation: this.startLocation,
                    endLocation: this.endLocation,
                    startLatitude: startCoords[1],
                    startLongitude: startCoords[0],
                    endLatitude: endCoords[1],
                    endLongitude: endCoords[0],
                };
                const response = await fetch('/api/runs/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(runDetails),
                });
                // Handle response...
            } catch (error) {
                console.error('Error creating event:', error);
            }
        },


        async signUpForRun(runId) {
            try {
                const response = await fetch(`/api/runs/signup/${runId}`, {
                    method: 'PUT',
                    // Additional configuration as needed, including headers or authentication tokens
                });
                if (response.ok) {
                    alert('Signed up successfully!');
                    // Refresh the list of runs or update the UI as needed
                } else {
                    alert('Failed to sign up for the run');
                }
            } catch (error) {
                console.error('Error signing up for run:', error);
            }
        },
        async geocodeLocation(locationString) {
            try {
                const response = await fetch('/api/geocode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ locationString }),
                });
                if (response.ok) {
                    const { coordinates } = await response.json();
                    return coordinates;
                } else {
                    alert('Failed to geocode location');
                    return null;
                }
            } catch (error) {
                console.error('Geocoding error:', error);
                return null;
            }
        },
    },
}).mount('#app');