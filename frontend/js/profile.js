document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login/';
        return;
    }

    const username = localStorage.getItem('username') || 'User';
    document.getElementById('profile-info').innerHTML = `
        <div class="card" style="max-width:400px; margin:0 auto;">
            <h2 style="margin-top:0;">Profile</h2>
            <p><strong>Username:</strong> ${username}</p>
            <p class="text-muted">Manage your LinkPulse account.</p>
        </div>
    `;

    document.getElementById('logout-btn').addEventListener('click', async function(e) {
        e.preventDefault();
        try { await apiRequest('/auth/logout/', 'POST'); } catch (err) {}
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login/';
    });
});
