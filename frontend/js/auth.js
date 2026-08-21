document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = '';
            messageDiv.className = '';

            try {
                const data = await apiRequest('/auth/login/', 'POST', { username, password });
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                window.location.href = '/dashboard/';
            } catch (error) {
                let errorMsg = 'Invalid credentials. Please try again.';
                if (error && error.message) {
                    try {
                        const parsed = JSON.parse(error.message);
                        if (parsed.detail) errorMsg = parsed.detail;
                    } catch (err) {}
                }
                messageDiv.textContent = errorMsg;
                messageDiv.className = 'error';
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
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = '';
            messageDiv.className = '';

            try {
                const data = await apiRequest('/auth/register/', 'POST', { username, email, password, password2 });
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                window.location.href = '/dashboard/';
            } catch (error) {
                let errorMsg = 'Registration failed. Please check your details.';
                if (error && error.message) {
                    try {
                        const parsed = JSON.parse(error.message);
                        if (parsed.username) errorMsg = parsed.username;
                        else if (parsed.email) errorMsg = parsed.email;
                        else if (parsed.password) errorMsg = parsed.password;
                        else if (parsed.password2) errorMsg = parsed.password2;
                        else if (parsed.detail) errorMsg = parsed.detail;
                    } catch (err) {}
                }
                messageDiv.textContent = errorMsg;
                messageDiv.className = 'error';
            }
        });
    }
});
