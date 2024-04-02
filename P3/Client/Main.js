function setUpEventListeners() {
    document.getElementById('loginForm').onsubmit = async function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const credentials = window.btoa(username + ':' + password);

        try {
            const response = await fetch(this.action, {
                method: this.method,
                headers: {
                    'Authorization': 'Basic ' + credentials
                }
            });

            if (response.ok) {
                const data = await response.json();
                alert('Login successful!');
                console.log('Response:', data);
            } else {
                alert('Login failed!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
}

setUpEventListeners();
