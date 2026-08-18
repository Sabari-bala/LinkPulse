document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login/';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const linkId = params.get('link_id');
    if (!linkId) {
        document.getElementById('message').textContent = 'No link ID provided.';
        return;
    }

    document.getElementById('link-id').value = linkId;

    try {
        const link = await apiRequest(`/links/${linkId}/`, 'GET');
        document.getElementById('original_url').value = link.original_url;
        document.getElementById('short_code').value = link.short_code;
        document.getElementById('is_active').checked = link.is_active;
        if (link.expires_at) {
            // Convert UTC to local datetime-local format
            const d = new Date(link.expires_at);
            const offset = d.getTimezoneOffset();
            const local = new Date(d.getTime() - offset * 60000);
            document.getElementById('expires_at').value = local.toISOString().slice(0, 16);
        }
    } catch (error) {
        showMessage('Failed to load link details.', 'error');
    }

    document.getElementById('link-details-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const original_url = document.getElementById('original_url').value;
        const short_code = document.getElementById('short_code').value.trim();
        const is_active = document.getElementById('is_active').checked;
        const expires_at = document.getElementById('expires_at').value || null;

        try {
            await apiRequest(`/links/${linkId}/`, 'PUT', {
                original_url,
                short_code,
                is_active,
                expires_at: expires_at ? new Date(expires_at).toISOString() : null
            });
            showMessage('Link updated successfully!', 'success');
        } catch (error) {
            showMessage('Failed to update link. Check short code uniqueness.', 'error');
        }
    });

    document.getElementById('delete-btn').addEventListener('click', async function() {
        if (!confirm('Are you sure you want to delete this link?')) return;
        try {
            await apiRequest(`/links/${linkId}/`, 'DELETE');
            window.location.href = '/dashboard/';
        } catch (error) {
            showMessage('Failed to delete link.', 'error');
        }
    });

    document.getElementById('logout-btn').addEventListener('click', async function(e) {
        e.preventDefault();
        try { await apiRequest('/auth/logout/', 'POST'); } catch (err) {}
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login/';
    });
});

function showMessage(message, type) {
    const msgDiv = document.getElementById('message');
    msgDiv.textContent = message;
    msgDiv.style.color = type === 'error' ? 'red' : 'green';
}
