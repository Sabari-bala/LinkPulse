document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login/';
        return;
    }

    const createForm = document.getElementById('create-link-form');
    const submitBtn = createForm ? createForm.querySelector('button[type="submit"]') : null;

    if (createForm && submitBtn) {
        createForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const original_url = document.getElementById('original_url').value.trim();
            const short_code = document.getElementById('short_code').value.trim();

            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';

            try {
                const payload = { original_url };
                if (short_code) payload.short_code = short_code;
                const data = await apiRequest('/links/', 'POST', payload);
                createForm.style.display = 'none';
                const successDiv = document.getElementById('success-state');
                successDiv.style.display = 'block';
                const shortUrl = `${window.location.origin}/${data.short_code}`;
                document.getElementById('new-short-url').textContent = shortUrl;
                document.getElementById('copy-new-url').dataset.url = shortUrl;
                showToast('Link created successfully', 'success');
            } catch (error) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Link';
                let errorMsg = 'Failed to create link. Please check the URL and try again.';
                if (error && error.message) {
                    try {
                        const parsed = JSON.parse(error.message);
                        if (parsed.original_url) errorMsg = parsed.original_url;
                        else if (parsed.short_code) errorMsg = parsed.short_code;
                        else if (parsed.detail) errorMsg = parsed.detail;
                        else if (typeof parsed === 'string') errorMsg = parsed;
                    } catch (e) {}
                }
                alert(errorMsg);
            }
        });
    }

    const copyBtn = document.getElementById('copy-new-url');
    if (copyBtn) {
        copyBtn.addEventListener('click', async function() {
            try {
                await copyToClipboard(this.dataset.url);
                const original = this.textContent;
                this.textContent = 'Copied';
                setTimeout(() => { this.textContent = original; }, 1500);
            } catch (err) {
                alert('Copy failed. Please copy manually.');
            }
        });
    }

    const createAnotherBtn = document.getElementById('create-another-link');
    if (createAnotherBtn) {
        createAnotherBtn.addEventListener('click', function() {
            createForm.reset();
            createForm.style.display = 'block';
            document.getElementById('success-state').style.display = 'none';
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Link';
            }
            document.getElementById('original_url').focus();
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
