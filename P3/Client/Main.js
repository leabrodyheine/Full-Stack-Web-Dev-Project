import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const mapboxAccessToken = 'pk.eyJ1IjoibGJoNSIsImEiOiJjbHU1bzBtc3IwdHljMmlueGc2aWQwamIxIn0.KFx5qzUkJz9ubiQ41wxYpg'

const app = createApp({
    components: {
        'pace-chart': PaceChart
    },
    data() {
        return {
            runs: [],
            showSection: 'login',
            showSignUpModal: false,
            selectedRun: null,
            signUpUsername: '',
            username: '',
            password: '',
            eventName: '',
            eventDate: '',
            startTime: '',
            startLocation: '',
            endLocation: '',
            runType: '',
            runPace: '',
            runLength: '',
            totalTime: '',
            showProfile: false,
            currentTab: 'Signed Up Runs',
            isLoggedIn: false,
            userId: null,
            map: null,
            currentMarkerType: 'stop',
            startLocationCoordinates: null,
            endLocationCoordinates: null,
            stopsCoordinates: [],
            selectedExperienceLevel: '',
            selectedLocation: '',
            fetchTimeout: null,
            stats: {
                runningStats: {
                    distance: 0,
                    time: 0,
                    runs: 0
                }
            },
            imagePaths: [
                'images/steven-lelham-atSaEOeE8Nk-unsplash.jpg',
                'images/fabio-comparelli-uq2E2V4LhCY-unsplash.jpg',
                'images/jenny-hill-mQVWb7kUoOE-unsplash.jpg',
                'images/jeremy-lapak-CVvFVQ_-oUg-unsplash.jpg',
                'images/joshua-earle-Lfxav1eVM4Y-unsplash.jpg',
                'images/miguel-a-amutio-Y0woUmyxGrw-unsplash.jpg',
                'images/brian-erickson-ukqBUIYk6zM-unsplash.jpg',
                'images/brian-erickson-XFneC_rHR48-unsplash.jpg',
                'images/brian-metzler-nmWQ2SKvj5M-unsplash.jpg',
                'images/bruno-nascimento-PHIgYUGQPvU-unsplash.jpg',
                'images/chander-r-AtfA8NDgpKA-unsplash.jpg',
                'images/chander-r-lg_T5aatVdo-unsplash.jpg',
                'images/emma-simpson-mNGaaLeWEp0-unsplash.jpg',
                'images/florian-kurrasch-70shTdGaZQs-unsplash.jpg',
                'images/greg-rosenke-MJNbBLx9W5U-unsplash.jpg',
                'images/hendrik-morkel-PEuBo_tBHDw-unsplash.jpg',
                'images/jakob-owens-A4579vLezz8-unsplash.jpg',
                'images/joel-jasmin-forestbird-znoL1m6MD_k-unsplash.jpg',
                'images/josiah-weiss-3dCljt2Pud8-unsplash.jpg',
                'images/julien-laurent-2CH0OyexAdw-unsplash.jpg',
                'images/lucas-pelucas-T7arF_i4hKQ-unsplash.jpg',
                'images/maksim-shutov-H8vhhepiiaU-unsplash.jpg',
                'images/mary-west-ljUyaxWEVzU-unsplash.jpg',
                'images/p-d-p-lK5GsWh36g0-unsplash.jpg',
                'images/ryan-bahm-fMMpsyHCeK0-unsplash.jpg',
                'images/ryoji-iwata-swu82B_JCFY-unsplash.jpg',
                'images/sage-friedman-TT2J5t1QaMw-unsplash.jpg',
                'images/tim-foster-Odhl-kitI2c-unsplash.jpg'
            ],
            showCompletionModal: false,
            completionDetails: { time: 0, distance: 0, pace: 0 },
            selectedRunForCompletion: null,
            paceChartData: null,
            paceChartOptions: {
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Pace (min/km)'
                        }
                    },
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Pace Over Time'
                    }
                }
            }
        };
    },

    mounted() {
        this.fetchRuns();
    },

    methods: {
        async fetchRuns() {
            try {
                const response = await fetch('/api/runs/allRuns');
                if (response.ok) {
                    let runsData = await response.json();
                    runsData = runsData.map(run => ({
                        ...run,
                        imagePath: this.getRunImage(), // Assign a persistent image 
                        isUserSignedUp: run.signUps.includes(this.userId),
                    }));
                    this.runs = runsData;
                } else {
                    console.error('Failed to fetch runs');
                }
            } catch (error) {
                console.error('Error fetching runs:', error);
            }
        },

        async fetchFilteredRuns() {
            console.log(this.selectedExperienceLevel);
            try {
                const response = await fetch('/api/runs/filtered', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        experienceLevel: this.selectedExperienceLevel
                    })
                });
                if (response.ok) {
                    this.runs = await response.json();
                } else {
                    console.log(response)
                    console.error('Failed to fetch filtered runs');
                }
            } catch (error) {
                console.error('Error fetching runs:', error);
            }
        },        

        showCreateRun() {
            this.showSection = 'createRun';
            document.getElementById('create-run-header').style.display = 'block'
            this.$nextTick(() => {
                if (!this.map && document.getElementById('map')) {
                    this.initializeMap();
                } else {
                    console.error('Map container not found or map already initialized');
                }
            });
        },

        initializeMap() {
            if (!document.getElementById('map')) {
                console.error('Map container is not available.');
                return;
            }
            mapboxgl.accessToken = mapboxAccessToken;
            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-74.5, 40],
                zoom: 9
            });

            this.map.on('load', () => {
                this.map.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: []
                        }
                    }
                });
                this.map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#3887be',
                        'line-width': 5,
                        'line-opacity': 0.75
                    }
                });
                this.addMapLegend();
            });

            this.map.on('click', (e) => {
                this.addMarker(e.lngLat, this.currentMarkerType);

            })
        },

        addMarker(lngLat, type) {
            let color;
            if (type === 'start') {
                this.startLocationCoordinates = [lngLat.lng, lngLat.lat];
                color = 'cornflowerblue';
            } else if (type === 'end') {
                this.endLocationCoordinates = [lngLat.lng, lngLat.lat];
                color = 'mediumseagreen';
            } else { // type assumed to be 'stop'
                this.stopsCoordinates.push([lngLat.lng, lngLat.lat]);
                color = 'lightcoral';
            }


            new mapboxgl.Marker({ color, draggable: true })
                .setLngLat([lngLat.lng, lngLat.lat])
                .addTo(this.map);

            // Update the route after adding the marker
            if (this.startLocationCoordinates && this.endLocationCoordinates) {
                this.updateRoute();
            }
        },

        updateRoute() {
            if (!this.startLocationCoordinates || !this.endLocationCoordinates) {
                return; // We need at least a start and end to draw a route
            }
            const waypoints = this.stopsCoordinates.map(coord => coord.join(',')).join(';');

            const coordinates = this.startLocationCoordinates.join(',') + ';' + (waypoints ? waypoints + ';' : '') + this.endLocationCoordinates.join(',');
            const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?geometries=geojson&steps=true&access_token=${mapboxAccessToken}`;

            // Fetch the route from the Mapbox Directions API
            fetch(directionsUrl)
                .then(response => response.json())
                .then(data => {
                    const route = data.routes[0].geometry;
                    this.map.getSource('route').setData({
                        type: 'Feature',
                        properties: {},
                        geometry: route
                    });
                })
                .catch(error => {
                    console.error('Error fetching route:', error);
                });
        },


        addMapLegend() {
            const legend = document.createElement('div');
            legend.innerHTML = `<h4>Legend</h4>
            <div><span style="height: 10px; width: 10px; background-color: cornflowerblue; display: inline-block;"></span> Start</div>
            <div><span style="height: 10px; width: 10px; background-color: mediumseagreen; display: inline-block;"></span> End</div>
            <div><span style="height: 10px; width: 10px; background-color: lightcoral; display: inline-block;"></span> Stops</div>`;
            legend.className = 'mapboxgl-ctrl legend';
            this.map.addControl(new mapboxgl.NavigationControl());
            this.map.getContainer().appendChild(legend);
        },

        promptForDescription(lngLat, marker) {
            const description = prompt("Enter a description for this stop:");
            if (description !== null) {
                this.runDetails.stops.push({
                    longitude: lngLat.lng,
                    latitude: lngLat.lat,
                    description: description
                });
            } else {
                marker.remove();
            }
        },

        updateStopLocation(newCoords) {
            console.log('Updated location:', newCoords);
        },
        setStartLocation(lngLat) {
            this.runDetails.startLocation = lngLat;
        },
        setEndLocation(lngLat) {
            this.runDetails.endLocation = lngLat;
        },

        async fetchSignedUpRuns() {
            try {
                const response = await fetch(`/api/runs/signed-up/${this.userId}`);
                if (response.ok) {
                    const signedUpRuns = await response.json();
                    this.runs.forEach(run => {
                        run.isUserSignedUp = signedUpRuns.some(signedUpRun => signedUpRun._id === run._id);
                    });
                } else {
                    console.error('Failed to fetch signed-up runs');
                }
            } catch (error) {
                console.error('Error fetching signed-up runs:', error);
            }
        },


        async login() {
            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: this.username, password: this.password }),
                });
                if (response.ok) {
                    const userData = await response.json();
                    this.username = '';
                    this.password = '';
                    this.isLoggedIn = true;
                    this.userId = userData.userId;
                    await this.fetchRuns();
                    await this.fetchSignedUpRuns();
                    this.fetchUserStats();
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
                    this.username = '';
                    this.password = '';
                    this.isLoggedIn = true;
                    const userData = await response.json();
                    this.userId = userData.userId;
                    await this.fetchRuns();
                    await this.fetchSignedUpRuns();
                    this.fetchUserStats();
                    this.showSection = 'eventList';
                } else {
                    alert('Registration failed!');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },

        openSignUpModal(run) {
            this.selectedRun = run;
            this.showSignUpModal = true;
        },

        closeSignUpModal() {
            this.showSignUpModal = false;
        },

        toggleProfile() {
            this.showProfile = !this.showProfile;
            this.showSection = this.showProfile ? '' : 'eventList';
            if (this.showProfile) {
                this.currentTab = 'Signed Up Runs';
            }
        },

        closeSignUpModal() {
            this.showSignUpModal = false;
        },

        backToRuns() {
            this.showProfile = false;
            this.showSection = 'eventList';
        },

        async submitRun() {
            try {
                const runDetails = {
                    ...this.runDetails,
                    startLocationCoordinate: this.startLocationCoordinates,
                    endLocationCoordinate: this.endLocationCoordinates,
                    stopsCoordinate: this.stopsCoordinates,
                    eventName: this.eventName,
                    date: this.eventDate,
                    startTime: this.startTime,
                    runType: this.runType,
                    startLocation: this.startLocation,
                    endLocation: this.endLocation,
                    runPace: this.runPace,
                    totalTime: this.totalTime
                };
                const response = await fetch('/api/runs/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(runDetails),
                });
                if (response.ok) {
                    alert('Run created successfully!');
                    this.fetchRuns();
                    document.getElementById('create-run-header').style.display = 'none'
                    this.showSection = 'eventList';
                } else {
                    alert('Failed to create run');
                }
            } catch (error) {
                console.error('Error creating event:', error);
            }
        },

        async submitSignUp() {
            try {
                const response = await fetch(`/api/runs/signup/${this.selectedRun._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: this.userId }),
                });
                if (response.ok) {
                    alert('Signed up successfully!');
                    this.showSignUpModal = false;
                    this.fetchRuns();
                    await this.fetchSignedUpRuns();
                } else {
                    alert('Failed to sign up for the run');
                }
            } catch (error) {
                console.error('Error signing up for run:', error);
            }
        },

        getRunImage() {
            const index = Math.floor(Math.random() * this.imagePaths.length);
            return this.imagePaths[index];
        },

        async markRunAsCompleted() {
            console.log("Submitting run completion details:", {
                userId: this.userId,
                time: this.completionDetails.time,
                distance: this.completionDetails.distance,
                pace: this.completionDetails.pace,
            });
            try {
                const response = await fetch(`/api/runs/complete/${this.selectedRunForCompletion._id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: this.userId,
                        time: this.completionDetails.time,
                        distance: this.completionDetails.distance,
                        pace: this.completionDetails.pace,
                    }),
                });
                if (response.ok) {
                    // Immediately reflect changes in UI without refetching
                    const updatedRun = await response.json();
                    const runIndex = this.runs.findIndex(run => run._id === this.selectedRunForCompletion._id);
                    if (runIndex !== -1) {
                        this.runs.splice(runIndex, 1, updatedRun); // Replace the run with its updated version
                    }
                    this.showCompletionModal = false;
                } else {
                    console.error('Failed to mark run as completed');
                }
            } catch (error) {
                console.error('Error marking run as completed:', error);
            }
        },

        openCompletionModal(run) {
            this.selectedRunForCompletion = run;
            const calculatedTime = run.runPace && run.runLength ? run.runPace * run.runLength : 0;
            this.completionDetails = {
                time: run.time || calculatedTime,
                distance: run.runLength,
                pace: run.runPace,
            };
            this.showCompletionModal = true;
        },

        async fetchUserStats() {
            if (!this.userId) {
                console.error("User ID is not set.");
                return;
            }
            const response = await fetch(`/api/stats/user-stats/${this.userId}`);
            if (response.ok) {
                const statsData = await response.json();
                // Ensure statsData is not null and has the properties we expect
                if (statsData && 'totalDistance' in statsData && 'totalTime' in statsData && 'runsCompleted' in statsData) {
                    this.stats.runningStats.distance = statsData.totalDistance;
                    this.stats.runningStats.time = statsData.totalTime;
                    this.stats.runningStats.runs = statsData.runsCompleted;
                    this.stats.runningStats.pace = this.calculateAveragePace(statsData);
                    this.stats.runningStats.experienceLevel = this.calculateExperienceLevel(statsData);
                    this.paceChartData = this.prepareChartData(statsData.paceData || []); // Provide a fallback in case paceData is undefined
                } else {
                    // Handle the case where statsData doesn't have the information we need
                    console.error('User stats data is missing required properties.');
                }
            } else {
                console.error('Failed to fetch user stats');
            }
        },


        calculateAveragePace(statsData) {
            if (!statsData.paceData || statsData.paceData.length === 0) {
                return 0;
            }
            let totalPace = 0;
            let count = 0;
            statsData.paceData.forEach(entry => {
                if (entry.pace) {
                    totalPace += entry.pace;
                    count++;
                }
            });
            if (count === 0) return 0;
            return (totalPace / count).toFixed(2);
        },

        calculateExperienceLevel(statsData) {
            const totalDistance = statsData.totalDistance;

            if (totalDistance < 50) {
                return 'Beginner';
            } else if (totalDistance >= 50 && totalDistance < 150) {
                return 'Intermediate';
            } else if (totalDistance >= 150 && totalDistance < 400) {
                return 'Advanced';
            } else if (totalDistance >= 400) {
                return 'Expert';
            } else {
                return 'Beginner'
            }
        },

        prepareChartData(paceData) {
            return {
                labels: paceData.map(entry => new Date(entry.date).toLocaleDateString()),
                datasets: [{
                    label: 'Pace over Time',
                    backgroundColor: '#f87979',
                    data: paceData.map(entry => entry.pace)
                }]
            };
        }
    },
    computed: {
        signedUpRuns() {
            return this.runs.filter(run => run.signUps.includes(this.userId) && !run.completedBy.find(completion => completion.userId === this.userId));
        },

        completedRuns() {
            return this.runs
                .filter(run => run.completedBy.some(completion => completion.userId === this.userId))
                .map(run => {
                    const userCompletion = run.completedBy.find(completion => completion.userId === this.userId);
                    return {
                        ...run,
                        completedDetails: userCompletion,
                    };
                });
        }
    }
})

app.component('pace-chart', PaceChart);

app.mount('#app');