document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login/';
        return;
    }

    const createForm = document.getElementById('create-link-form');
    if (createForm) {
        createForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const original_url = document.getElementById('original_url').value;
            const short_code = document.getElementById('short_code').value.trim();

            const payload = { original_url };
            if (short_code) payload.short_code = short_code;

            const submitBtn = createForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';

            try {
                const data = await apiRequest('/links/', 'POST', payload);
                showToast('Link created successfully', 'success');
                createForm.style.display = 'none';
                const successDiv = document.getElementById('success-state');
                successDiv.style.display = 'block';
                const shortUrl = `${window.location.origin}/${data.short_code}`;
                document.getElementById('new-short-url').textContent = shortUrl;
                document.getElementById('open-link').href = shortUrl;
            } catch (error) {
                showToast('Failed to create link. Check your details.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
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
