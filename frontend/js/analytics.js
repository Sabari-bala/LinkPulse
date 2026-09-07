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
            html += `<tr><td>${new Date(click.clicked_at).toLocaleString()}</td><td>${click.link__short_code}</td><td>${click.browser}</td><td>${click.device_category}</td></tr>`;
        });
        html += '</tbody></table>';
    } else {
        html += '<p class="text-muted">No clicks yet.</p>';
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
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:1rem;">
            <div class="card"><h3>Clicks Over Time</h3><canvas id="clicksChart"></canvas></div>
            <div class="card"><h3>Devices</h3><canvas id="deviceChart"></canvas></div>
            <div class="card"><h3>Browsers</h3><canvas id="browserChart"></canvas></div>
            <div class="card"><h3>Operating Systems</h3><canvas id="osChart"></canvas></div>
        </div>
        <h3 class="mt-3">Recent Clicks</h3>
        <table class="link-table"><thead><tr><th>Time</th><th>Browser</th><th>Device</th><th>OS</th><th>Referrer</th></tr></thead><tbody>`;
    data.recent_clicks.forEach(click => {
        html += `<tr><td>${new Date(click.clicked_at).toLocaleString()}</td><td>${click.browser}</td><td>${click.device_category}</td><td>${click.operating_system}</td><td>${click.referrer || '-'}</td></tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;

    // Charts
    const clicksCtx = document.getElementById('clicksChart').getContext('2d');
    new Chart(clicksCtx, {
        type: 'line',
        data: {
            labels: data.clicks_over_time.map(item => item.date),
            datasets: [{
                label: 'Clicks',
                data: data.clicks_over_time.map(item => item.count),
                borderColor: '#5B4AEF',
                backgroundColor: 'rgba(91,74,239,0.1)',
                fill: true,
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });

    const deviceCtx = document.getElementById('deviceChart').getContext('2d');
    new Chart(deviceCtx, {
        type: 'doughnut',
        data: {
            labels: data.device_breakdown.map(item => item.device_category || 'Unknown'),
            datasets: [{
                data: data.device_breakdown.map(item => item.count),
                backgroundColor: ['#5B4AEF','#16A34A','#D97706','#94A3B8']
            }]
        },
        options: { responsive: true }
    });

    const browserCtx = document.getElementById('browserChart').getContext('2d');
    new Chart(browserCtx, {
        type: 'bar',
        data: {
            labels: data.browser_breakdown.map(item => item.browser || 'Unknown'),
            datasets: [{
                label: 'Clicks',
                data: data.browser_breakdown.map(item => item.count),
                backgroundColor: '#5B4AEF'
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });

    const osCtx = document.getElementById('osChart').getContext('2d');
    new Chart(osCtx, {
        type: 'bar',
        data: {
            labels: data.os_breakdown.map(item => item.operating_system || 'Unknown'),
            datasets: [{
                label: 'Clicks',
                data: data.os_breakdown.map(item => item.count),
                backgroundColor: '#4638C8'
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
}
