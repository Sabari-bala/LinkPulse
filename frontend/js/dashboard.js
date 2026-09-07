document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token) {
        window.location.href = '/login/';
        return;
    }

    document.getElementById('welcome-user').textContent = username || 'there';

    // Load stats
    try {
        const analytics = await apiRequest('/analytics/', 'GET');
        renderStats(analytics);
    } catch (error) {
        console.error('Failed to load analytics', error);
        document.getElementById('stats-container').innerHTML = '<div class="text-muted">Could not load statistics.</div>';
    }

    // Initial load
    loadLinks(1);

    // Event listeners
    document.getElementById('link-search').addEventListener('input', debounce(() => loadLinks(1), 300));
    document.getElementById('status-filter').addEventListener('change', () => loadLinks(1));
    document.getElementById('sort-links').addEventListener('change', () => loadLinks(1));

    document.getElementById('logout-btn').addEventListener('click', async function(e) {
        e.preventDefault();
        try { await apiRequest('/auth/logout/', 'POST'); } catch (err) {}
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login/';
    });
});

function debounce(fn, delay) {
    let timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
}

async function loadLinks(page = 1) {
    const search = document.getElementById('link-search').value.trim();
    const status = document.getElementById('status-filter').value;
    const sort = document.getElementById('sort-links').value;

    const params = new URLSearchParams();
    params.set('page', page);
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (sort) params.set('sort', sort);

    try {
        const data = await apiRequest(`/links/?${params.toString()}`, 'GET');
        renderLinks(data.results || []);
        renderPagination(data, page);
    } catch (error) {
        document.getElementById('links-container').innerHTML = '<p class="error">Failed to load links. Please try again.</p>';
    }
}

function renderStats(analytics) {
    const container = document.getElementById('stats-container');
    container.innerHTML = `
        <div class="stat-card"><div class="label">Total Links</div><div class="value">${analytics.total_links}</div></div>
        <div class="stat-card"><div class="label">Total Clicks</div><div class="value">${analytics.total_clicks}</div></div>
        <div class="stat-card"><div class="label">Active Links</div><div class="value">${analytics.active_links}</div></div>
        <div class="stat-card"><div class="label">Expired Links</div><div class="value">${analytics.expired_links}</div></div>
    `;
}

function renderLinks(links) {
    const container = document.getElementById('links-container');
    if (!links || links.length === 0) {
        container.innerHTML = `
            <div class="card text-center" style="padding:3rem 1rem;">
                <h3>No links found</h3>
                <p class="text-muted">Try adjusting your search or create a new link.</p>
                <a href="/create-link/" class="btn mt-2">+ Create Link</a>
            </div>
        `;
        return;
    }

    let html = '<table class="link-table"><thead><tr><th>Short URL</th><th>Original URL</th><th>Status</th><th>Clicks</th><th>Actions</th></tr></thead><tbody>';
    links.forEach(link => {
        const shortUrl = `${window.location.origin}/${link.short_code}`;
        const statusBadge = link.is_active ? (link.is_expired ? '<span class="badge badge-warning">Expired</span>' : '<span class="badge badge-success">Active</span>') : '<span class="badge badge-danger">Disabled</span>';
        html += `<tr>
            <td data-label="Short URL">
                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                    <a href="${shortUrl}" target="_blank" title="${shortUrl}">${shortUrl}</a>
                    <button class="btn btn-sm btn-outline copy-url" data-url="${shortUrl}" style="padding:0.25rem 0.5rem; min-height:auto;">Copy</button>
                </div>
            </td>
            <td data-label="Original URL" class="text-muted" title="${link.original_url}">${link.original_url.length > 50 ? link.original_url.substring(0, 50) + '...' : link.original_url}</td>
            <td data-label="Status">${statusBadge}</td>
            <td data-label="Clicks">${link.click_count}</td>
            <td data-label="Actions" class="link-actions-cell">
                <div class="link-actions">
                    <a href="/analytics/?link_id=${link.id}" class="btn btn-outline btn-sm">Analytics</a>
                    <a href="/link-details/?link_id=${link.id}" class="btn btn-outline btn-sm">Details</a>
                    <button onclick="deleteLink(${link.id})" class="btn btn-danger-outline btn-sm">Delete</button>
                </div>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;

    document.querySelectorAll('.copy-url').forEach(btn => {
        btn.addEventListener('click', function() {
            const url = this.dataset.url;
            copyToClipboard(url).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Copied';
                this.classList.add('btn-success');
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('btn-success');
                }, 1500);
            });
        });
    });
}

function renderPagination(data, currentPage) {
    const container = document.getElementById('pagination-controls');
    let html = '';
    if (data.previous) {
        html += `<button class="btn btn-outline btn-sm" onclick="loadLinks(${currentPage - 1})">Previous</button>`;
    }
    html += `<span class="text-muted">Page ${currentPage}</span>`;
    if (data.next) {
        html += `<button class="btn btn-outline btn-sm" onclick="loadLinks(${currentPage + 1})">Next</button>`;
    }
    container.innerHTML = html;
}

async function deleteLink(id) {
    confirmDelete(async () => {
        try {
            await apiRequest(`/links/${id}/`, 'DELETE');
            showToast('Link deleted successfully', 'success');
            setTimeout(() => loadLinks(1), 500);
        } catch (error) {
            showToast('Unable to delete link', 'error');
        }
    });
}

