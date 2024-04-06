import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import PaceChart from './charts/PaceChart.js';


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
            showCompletionModal: false,
            completionDetails: { time: 0, distance: 0, pace: 0 },
            selectedRunForCompletion: null,
            paceChartData: null,
            paceChartOptions: {
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Pace (min/km)'
                        }
                    }],
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Pace Over Time'
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
                const response = await fetch('/api/runs');
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
                    runPace: this.runPace
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
        calculateExperienceLevel(distance) {
            // logic here later
        },
        getRunImage() {
            const index = Math.floor(Math.random() * this.imagePaths.length);
            return this.imagePaths[index];
        },

        async markRunAsCompleted() {
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
                    console.log('Run marked as completed successfully!');
                } else {
                    console.error('Failed to mark run as completed');
                }
            } catch (error) {
                console.error('Error marking run as completed:', error);
            }
        },

        openCompletionModal(run) {
            console.log("Opening completion modal for run:", run);
            this.selectedRunForCompletion = run;
            const calculatedTime = run.runPace && run.runLength ? run.runPace * run.runLength : 0;
            this.completionDetails = {
                time: run.time || calculatedTime,
                distance: run.runLength,
                pace: run.runPace,
            };
            this.showCompletionModal = true;
            console.log("showCompletionModal set to true");
        },

        async fetchUserStats() {
            console.log(this.userId);
            if (!this.userId) {
              console.error("User ID is not set.");
              return;
            }
            
            const response = await fetch(`/api/stats/user-stats/${this.userId}`);
            if (response.ok) {
              const statsData = await response.json();
              this.stats.runningStats = {
                  distance: statsData.totalDistance,
                  time: statsData.totalTime,
                  runs: statsData.runsCompleted,
                  paceOverTime: statsData.paceData
              };
              // Now, you need to prepare and pass this data to the PaceChart component
              this.paceChartData = this.prepareChartData(statsData.paceData);
            } else {
              console.error('Failed to fetch user stats');
            }
          },
          prepareChartData(paceData) {
            // Assuming paceData is an array of { date, pace } objects
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
            // Filter runs where the user is signed up and not yet completed
            return this.runs.filter(run => run.signUps.includes(this.userId) && !run.completedBy.find(completion => completion.userId === this.userId));
        },
        completedRuns() {
            // Filter runs where the user has completed them and extract the completion details
            return this.runs
                .filter(run => run.completedBy.some(completion => completion.userId === this.userId))
                .map(run => {
                    const userCompletion = run.completedBy.find(completion => completion.userId === this.userId);
                    return {
                        ...run,
                        completedDetails: userCompletion, // Make sure this property matches what is in your HTML template
                    };
                });
        }
    }
}).mount('#app');