const API_BASE = 'http://127.0.0.1:8000/api';

function getToken() {
    return localStorage.getItem('token');
}

async function apiRequest(url, method = 'GET', body = null, requireAuth = false) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }
    const config = {
        method,
        headers,
    };
    if (body) {
        config.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_BASE}${url}`, config);
    if (response.status === 401 && requireAuth) {
        localStorage.removeItem('token');
        window.location.href = '/login/';
        throw new Error('Unauthorized');
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(JSON.stringify(data));
    }
    return data;
}
