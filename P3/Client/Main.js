import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

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
            showProfile: false,
            currentTab: 'Signed Up Runs',
            isLoggedIn: false,
            userId: null,
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
                'images/miguel-a-amutio-Y0woUmyxGrw-unsplash.jpg'
            ],
        };
    },
    mounted() {
        this.fetchRuns();
    },
    methods: {
        async fetchRuns() {
            try {
                const response = await fetch('/api/runs');
                if (response.ok) {
                    let runsData = await response.json();
                    console.log("Runs fetched: ", runsData);
                    runsData = runsData.map(run => ({
                        ...run,
                        isUserSignedUp: run.signUps.includes(this.userId) // Assuming you have userId stored
                    }));
                    this.runs = runsData;
                } else {
                    console.error('Failed to fetch runs');
                }
            } catch (error) {
                console.error('Error fetching runs:', error);
            }
        },

        async fetchSignedUpRuns() {
            try {
                console.log("user id:" + this.userId)
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
                    console.log(`Logged in user ID: ${this.userId}`);
                    await this.fetchRuns();
                    await this.fetchSignedUpRuns(); // Ensure this is awaited
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
                    this.fetchRuns().then(() => this.fetchSignedUpRuns());
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
                    eventName: this.eventName,
                    date: this.eventDate,
                    startTime: this.startTime,
                    runType: this.runType,
                    startLocation: this.startLocation,
                    endLocation: this.endLocation,
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
                    body: JSON.stringify({ username: this.signUpUsername }),
                });
                if (response.ok) {
                    alert('Signed up successfully!');
                    this.showSignUpModal = false;
                    this.fetchRuns();
                } else {
                    alert('Failed to sign up for the run');
                }
            } catch (error) {
                console.error('Error signing up for run:', error);
            }
        },
        calculateExperienceLevel(distance) {
            // logic here later
        }
    },
    computed: {
        signedUpRuns() {
            return this.runs.filter(run => run.isUserSignedUp);
        }
    }
}).mount('#app');