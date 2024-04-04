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
                    const runsData = await response.json();
                    console.log("Runs fetched: ", runsData);
                    this.runs = runsData;
                } else {
                    console.error('Failed to fetch runs');
                }
            } catch (error) {
                console.error('Error fetching runs:', error);
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
                    this.username = '';
                    this.password = '';
                    this.isLoggedIn = true;
                    this.fetchRuns();
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
                    this.fetchRuns();
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
            if (this.showProfile) {
                this.showSection = '';
            } else {
                this.showSection = 'eventList';
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
    },
}).mount('#app');