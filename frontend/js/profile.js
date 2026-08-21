document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login/';
        return;
    }

    const profileContainer = document.getElementById('profile-info');
    const recentLinksContainer = document.getElementById('recent-links');

    try {
        const data = await apiRequest('/auth/me/', 'GET');
        renderProfile(data);
        renderRecentLinks(data.recent_links);
    } catch (error) {
        profileContainer.innerHTML = '<p class="text-muted">Unable to load profile.</p>';
    }

    document.getElementById('logout-btn').addEventListener('click', async function(e) {
        e.preventDefault();
        try { await apiRequest('/auth/logout/', 'POST'); } catch (err) {}
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login/';
    });
});

function renderProfile(data) {
    const date = new Date(data.date_joined).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const lastLogin = data.last_login ? new Date(data.last_login).toLocaleString() : 'Never';

    const container = document.getElementById('profile-info');
    container.innerHTML = `
        <div class="card" style="max-width:500px; margin:0 auto;">
            <h2 style="margin-top:0;">Profile</h2>
            <div style="margin-bottom:1.5rem;">
                <p><strong>Username:</strong> ${data.username}</p>
                <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
                <p><strong>Member since:</strong> ${date}</p>
                <p><strong>Last login:</strong> ${lastLogin}</p>
            </div>
        </div>
    `;
}

function renderRecentLinks(links) {
    const container = document.getElementById('recent-links');
    if (!links || links.length === 0) {
        container.innerHTML = '<p class="text-muted">No links created yet.</p>';
        return;
    }

    let html = '<h2>Recent Links</h2><div class="card"><table class="link-table"><thead><tr><th>Short URL</th><th>Original URL</th><th>Status</th><th>Clicks</th></tr></thead><tbody>';
    links.forEach(link => {
        const shortUrl = `${window.location.origin}/${link.short_code}`;
        const statusBadge = link.is_active ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-danger">Disabled</span>';
        html += `<tr>
            <td><a href="${shortUrl}" target="_blank">${shortUrl}</a></td>
            <td class="text-muted">${link.original_url.length > 50 ? link.original_url.substring(0,50)+'...' : link.original_url}</td>
            <td>${statusBadge}</td>
            <td>${link.click_count}</td>
        </tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}
