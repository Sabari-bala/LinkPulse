// UI helpers: mobile nav, toast, delete modal, copy
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    if (header && nav) {
        const toggle = document.createElement('button');
        toggle.className = 'menu-toggle';
        toggle.innerHTML = '<span></span><span></span><span></span>';
        toggle.setAttribute('aria-label', 'Toggle navigation');
        toggle.addEventListener('click', function() {
            nav.classList.toggle('open');
        });
        header.insertBefore(toggle, nav);
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => nav.classList.remove('open'));
        });
    }
});

function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function confirmDelete(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <h3>Delete this link?</h3>
            <p>This action cannot be undone.</p>
            <div class="modal-actions">
                <button class="btn btn-outline" id="cancel-delete">Cancel</button>
                <button class="btn btn-danger" id="confirm-delete">Delete Link</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#cancel-delete').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#confirm-delete').addEventListener('click', () => {
        overlay.remove();
        callback();
    });
}

function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => resolve())
                .catch(() => fallbackCopy(text, resolve, reject));
        } else {
            fallbackCopy(text, resolve, reject);
        }
    });
}

function fallbackCopy(text, resolve, reject) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        resolve();
    } catch (err) {
        reject(err);
    }
    document.body.removeChild(textarea);
}
