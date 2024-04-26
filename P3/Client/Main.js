import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const mapboxAccessToken = 'pk.eyJ1IjoibGJoNSIsImEiOiJjbHU1bzBtc3IwdHljMmlueGc2aWQwamIxIn0.KFx5qzUkJz9ubiQ41wxYpg'

const app = createApp({

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
            runPace: null,
            runLengthMiles: null,
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
            selectedExperienceLevel: 'all',
            userExperienceLevel: '',
            currentLocation: null,
            maxDistance: 5000,
            selectedRunLength: 'all',
            selectedRunTime: 'all',
            date: '',
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
            const runLengthQuery = this.getRunLengthQuery(this.selectedRunLength);
            try {
                const response = await fetch('/api/runs/filtered', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        experienceLevel: this.selectedExperienceLevel === 'all' ? '' : this.selectedExperienceLevel,
                        location: this.currentLocation,
                        maxDistance: this.maxDistance,
                        length: this.selectedRunLength === 'all' ? '' : runLengthQuery,
                        runTime: this.selectedRunTime === 'all' ? '' : this.selectedRunTime,
                        date: this.selectedDate
                    })
                });
                if (response.ok) {
                    this.runs = await response.json();
                } else {
                    console.error('Failed to fetch filtered runs');
                }
            } catch (error) {
                console.error('Error fetching runs:', error);
            }
        },

        getRunLengthQuery(selectedRunLength) {
            const lengthMap = {
                "all": undefined,
                "< 2": { $lt: 2 },
                "3-5": { $gte: 3, $lte: 5 },
                "6-8": { $gte: 6, $lte: 8 },
                "9-11": { $gte: 9, $lte: 11 },
                "12-14": { $gte: 12, $lte: 14 },
                "14+": { $gt: 14 }
            };
            return lengthMap[selectedRunLength];
        },

        setCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    this.currentLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                }, error => {
                    console.error('Error getting location:', error);
                });
            } else {
                alert("Geolocation is not supported by this browser.");
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
                if (!this.startLocationCoordinates) {
                    this.startLocationCoordinates = [lngLat.lng, lngLat.lat];
                    color = 'cornflowerblue';
                } else {
                    console.log('Start location already set');
                    return; // Exit early if start location is already set
                }
            } else if (type === 'end') {
                if (!this.endLocationCoordinates) {
                    this.endLocationCoordinates = [lngLat.lng, lngLat.lat];
                    color = 'mediumseagreen';
                } else {
                    console.log('End location already set');
                    return; // Exit early if end location is already set
                }
            } else {
                this.stopsCoordinates.push([lngLat.lng, lngLat.lat]);
                color = 'lightcoral';
            }

            const marker = new mapboxgl.Marker({ color, draggable: true })
                .setLngLat([lngLat.lng, lngLat.lat])
                .addTo(this.map);

            marker.on('dragend', () => {
                if (type === 'start') {
                    this.startLocationCoordinates = [marker.getLngLat().lng, marker.getLngLat().lat];
                } else if (type === 'end') {
                    this.endLocationCoordinates = [marker.getLngLat().lng, marker.getLngLat().lat];
                } else {
                    const index = this.stopsCoordinates.findIndex(coord => coord[0] === lngLat.lng && coord[1] === lngLat.lat);
                    if (index !== -1) {
                        this.stopsCoordinates[index] = [marker.getLngLat().lng, marker.getLngLat().lat];
                    }
                }
                this.updateRoute();
            });

            if (this.startLocationCoordinates && this.endLocationCoordinates) {
                this.updateRoute();
            }
        },

        updateRoute() {
            if (!this.startLocationCoordinates || !this.endLocationCoordinates) {
                return;
            }
            const waypoints = this.stopsCoordinates.map(coord => coord.join(',')).join(';');

            const coordinates = this.startLocationCoordinates.join(',') + ';' + (waypoints ? waypoints + ';' : '') + this.endLocationCoordinates.join(',');
            const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?geometries=geojson&steps=true&access_token=${mapboxAccessToken}`;

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
                    stopsCoordinate: this.stopsCoordinates.map(coord => ({
                        latitude: coord[1],
                        longitude: coord[0]
                    })),
                    startLocationCoordinate: {
                        type: 'Point',
                        coordinates: [this.startLocationCoordinates[0], this.startLocationCoordinates[1]] // longitude, latitude
                    },
                    endLocationCoordinate: {
                        type: 'Point',
                        coordinates: [this.endLocationCoordinates[0], this.endLocationCoordinates[1]] // longitude, latitude
                    },
                    eventName: this.eventName,
                    date: this.eventDate,
                    startTime: this.startTime,
                    startLocation: this.startLocation,
                    endLocation: this.endLocation,
                    runType: this.runType.toLowerCase(),
                    runPace: this.calculatePace(),
                    length: this.runLengthMiles,
                    totalTime: this.totalTime,
                }; 
                const response = await fetch('/api/runs/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(runDetails),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    alert('Run created successfully!');
                } else {
                    const errorData = await response.text();
                    console.error('Failed to create run:', errorData);
                    alert('Failed to create run');
                }
            } catch (error) {
                console.error('Error creating run:', error);
            }
        },

        calculatePace() {
            if (!this.totalTime || !this.runLengthMiles) {
                console.log('Missing data for pace calculation');
                console.log("Total Time:", this.totalTime, "Run Length:", this.runLengthMiles);
                return 0;
            }
            const pace = this.totalTime / this.runLengthMiles;  // Correct the variable name here
            console.log('Calculated pace:', pace);
            return pace;
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
                if (statsData && 'totalDistance' in statsData && 'totalTime' in statsData && 'runsCompleted' in statsData) {
                    this.stats.runningStats.distance = statsData.totalDistance;
                    console.log(statsData.totalDistance)
                    this.stats.runningStats.time = statsData.totalTime;
                    this.stats.runningStats.runs = statsData.runsCompleted;
                    this.stats.runningStats.pace = this.calculateAveragePace(statsData);
                    this.stats.runningStats.experienceLevel = this.calculateExperienceLevel(statsData);
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
                this.userExperienceLevel = 'Beginner';
                return 'Beginner';
            } else if (totalDistance >= 50 && totalDistance < 150) {
                this.userExperienceLevel = 'Intermediate';
                return 'Intermediate';
            } else if (totalDistance >= 150 && totalDistance < 400) {
                this.userExperienceLevel = 'Advanced';
                return 'Advanced';
            } else if (totalDistance >= 400) {
                this.userExperienceLevel = 'Expert';
                return 'Expert';
            } else {
                this.userExperienceLevel = 'Beginner';
                return 'Beginner'
            }
        },

        isLevelUnlocked(levelName) {
            const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
            return levels.indexOf(levelName) <= levels.indexOf(this.userExperienceLevel);
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
        },

        isBeginnerUnlocked() {
            return this.isLevelUnlocked('Beginner');
        },

        isIntermediateUnlocked() {
            return this.isLevelUnlocked('Intermediate');
        },

        isAdvancedUnlocked() {
            return this.isLevelUnlocked('Advanced');
        },

        isExpertUnlocked() {
            return this.isLevelUnlocked('Expert');
        },
    },
})

app.mount('#app');