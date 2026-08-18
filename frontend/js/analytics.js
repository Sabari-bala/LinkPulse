document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login/';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const linkId = params.get('link_id');
    const container = document.getElementById('analytics-container');

    try {
        if (linkId) {
            const data = await apiRequest(`/analytics/${linkId}/`, 'GET');
            renderLinkAnalytics(data);
        } else {
            const data = await apiRequest('/analytics/', 'GET');
            renderOverallAnalytics(data);
        }
    } catch (error) {
        container.innerHTML = '<p class="text-muted">Unable to load analytics.</p>';
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            try { await apiRequest('/auth/logout/', 'POST'); } catch (err) {}
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.href = '/login/';
        });
    }
});

function renderOverallAnalytics(data) {
    const container = document.getElementById('analytics-container');
    let html = `
        <h2>Overall Analytics</h2>
        <div class="stats-grid">
            <div class="stat-card"><div class="label">Total Links</div><div class="value">${data.total_links}</div></div>
            <div class="stat-card"><div class="label">Total Clicks</div><div class="value">${data.total_clicks}</div></div>
            <div class="stat-card"><div class="label">Active Links</div><div class="value">${data.active_links}</div></div>
            <div class="stat-card"><div class="label">Expired Links</div><div class="value">${data.expired_links}</div></div>
        </div>
    `;
    if (data.recent_clicks && data.recent_clicks.length > 0) {
        html += `<h3>Recent Clicks</h3><table class="link-table"><thead><tr><th>Time</th><th>Link</th><th>Browser</th><th>Device</th></tr></thead><tbody>`;
        data.recent_clicks.forEach(click => {
            html += `<tr>
                <td>${new Date(click.clicked_at).toLocaleString()}</td>
                <td>${click.link__short_code}</td>
                <td>${click.browser}</td>
                <td>${click.device_category}</td>
            </tr>`;
        });
        html += '</tbody></table>';
    } else {
        html += '<p class="text-muted">No clicks yet. Share your links to start collecting analytics.</p>';
    }
    container.innerHTML = html;
}

function renderLinkAnalytics(data) {
    const container = document.getElementById('analytics-container');
    const link = data.link;
    let html = `
        <h2>Link Analytics</h2>
        <div class="card mb-2">
            <h3 style="margin:0;">${link.short_code}</h3>
            <p class="text-muted">${link.original_url}</p>
            <div class="badge ${link.is_active ? 'badge-success' : 'badge-danger'}">${link.is_active ? 'Active' : 'Disabled'}</div>
        </div>
        <div class="stats-grid">
            <div class="stat-card"><div class="label">Total Clicks</div><div class="value">${data.total_clicks}</div></div>
        </div>
    `;
    if (data.recent_clicks && data.recent_clicks.length > 0) {
        html += `<h3>Recent Clicks</h3><table class="link-table"><thead><tr><th>Time</th><th>Browser</th><th>Device</th><th>OS</th></tr></thead><tbody>`;
        data.recent_clicks.forEach(click => {
            html += `<tr>
                <td>${new Date(click.clicked_at).toLocaleString()}</td>
                <td>${click.browser}</td>
                <td>${click.device_category}</td>
                <td>${click.operating_system}</td>
            </tr>`;
        });
        html += '</tbody></table>';
    } else {
        html += '<p class="text-muted">No clicks yet for this link.</p>';
    }
    container.innerHTML = html;
}
