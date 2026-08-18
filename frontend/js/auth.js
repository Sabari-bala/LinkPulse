document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            try {
                const data = await apiRequest('/auth/login/', 'POST', { username, password });
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                window.location.href = '/dashboard/';
            } catch (error) {
                displayMessage('Invalid credentials. Please try again.', 'error');
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const password2 = document.getElementById('password2').value;
            try {
                const data = await apiRequest('/auth/register/', 'POST', { username, email, password, password2 });
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                window.location.href = '/dashboard/';
            } catch (error) {
                displayMessage('Registration failed. Check your details.', 'error');
            }
        });
    }
});

function displayMessage(message, type) {
    const msgDiv = document.getElementById('message');
    msgDiv.textContent = message;
    msgDiv.style.color = type === 'error' ? 'red' : 'green';
}
