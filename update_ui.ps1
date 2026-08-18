# LinkPulse UI Overhaul Script
# Run from the LinkPulse root folder

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# ======================================================================
# 1. GLOBAL STYLES (style.css)
# ======================================================================
@'
:root {
    /* Brand */
    --primary: #4F46E5;
    --primary-dark: #3730A3;
    --primary-light: #EEF2FF;
    --primary-hover: #4338CA;

    /* Semantic */
    --success: #16A34A;
    --success-light: #DCFCE7;
    --danger: #DC2626;
    --danger-light: #FEE2E2;
    --warning: #D97706;
    --warning-light: #FEF3C7;

    /* Neutrals */
    --background: #F8FAFC;
    --surface: #FFFFFF;
    --text-primary: #0F172A;
    --text-secondary: #475569;
    --text-muted: #64748B;
    --border: #E2E8F0;

    /* Effects */
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-full: 999px;

    --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
    --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--background);
    color: var(--text-primary);
    line-height: 1.5;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
}

/* Links */
a {
    color: var(--primary);
    text-decoration: none;
    transition: color var(--transition);
}
a:hover {
    color: var(--primary-dark);
}

/* Header / Navbar */
header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

header .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--primary);
    text-decoration: none;
}
header .logo svg { width: 24px; height: 24px; }

nav {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

nav a, nav button {
    text-decoration: none;
    color: var(--text-secondary);
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-md);
    transition: background var(--transition), color var(--transition);
}

nav a:hover, nav button:hover {
    color: var(--primary);
    background: var(--primary-light);
}

nav a.active {
    background: var(--primary-light);
    color: var(--primary);
    font-weight: 600;
}

/* Mobile menu button */
.menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
}
.menu-toggle span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--text-primary);
    margin: 5px 0;
    transition: 0.2s;
}

/* Main container */
main {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1.5rem;
}

/* Buttons */
button, .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    background: var(--primary);
    color: white;
    border: 1.5px solid transparent;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: none;
    transition: background var(--transition), color var(--transition), transform var(--transition), box-shadow var(--transition), border-color var(--transition);
    box-shadow: var(--shadow-xs);
    min-height: 44px;
    line-height: 1.2;
    white-space: nowrap;
}

button:hover, .btn:hover {
    background: var(--primary-dark);
    box-shadow: var(--shadow-sm);
    transform: translateY(-1px);
}
button:active, .btn:active {
    transform: translateY(0);
}
button:disabled, .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-outline {
    background: transparent;
    border-color: var(--primary);
    color: var(--primary);
}
.btn-outline:hover {
    background: var(--primary-light);
    border-color: var(--primary);
    color: var(--primary-dark);
}

.btn-danger {
    background: var(--danger);
    color: white;
}
.btn-danger:hover {
    background: #B91C1C;
}

.btn-danger-outline {
    background: transparent;
    border-color: var(--danger);
    color: var(--danger);
}
.btn-danger-outline:hover {
    background: var(--danger-light);
    color: var(--danger);
}

.btn-success {
    background: var(--success);
    color: white;
}
.btn-success:hover {
    background: #15803D;
}

.btn-sm {
    padding: 0.4rem 0.8rem;
    font-size: 0.875rem;
    min-height: 40px;
}
.btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    min-height: 48px;
}

/* Cards */
.card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 1.5rem;
    transition: box-shadow var(--transition), transform var(--transition);
}
.card:hover {
    box-shadow: var(--shadow);
    transform: translateY(-2px);
}

/* Forms */
input, select, textarea {
    width: 100%;
    padding: 0.65rem 0.8rem;
    margin-bottom: 0.8rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    transition: border-color var(--transition), box-shadow var(--transition);
    background: var(--surface);
}
input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}
label {
    display: block;
    margin-bottom: 0.3rem;
    font-weight: 600;
    color: var(--text-primary);
}
.form-group {
    margin-bottom: 1rem;
}
.form-hint {
    font-size: 0.875rem;
    color: var(--text-muted);
}

/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    background: var(--surface);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
}
th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border);
}
th {
    background: #F1F5F9;
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
}
tr:last-child td {
    border-bottom: none;
}
tr:hover td {
    background-color: #F8FAFC;
}

/* Badges */
.badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: 0.8rem;
    font-weight: 600;
}
.badge-success {
    background: var(--success-light);
    color: var(--success);
}
.badge-danger {
    background: var(--danger-light);
    color: var(--danger);
}
.badge-warning {
    background: var(--warning-light);
    color: var(--warning);
}
.badge-muted {
    background: #F1F5F9;
    color: var(--text-muted);
}

/* Utilities */
.text-muted { color: var(--text-muted); }
.text-center { text-align: center; }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: 0.5rem; }
.gap-2 { gap: 1rem; }
.grid { display: grid; }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-1 { grid-template-columns: 1fr; }
@media (max-width: 768px) {
    .grid-cols-4, .grid-cols-2 { grid-template-columns: 1fr; }
}

/* Toast */
#toast-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 9999;
}
.toast {
    background: var(--text-primary);
    color: white;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideIn 0.3s ease;
}
.toast.success { background: var(--success); }
.toast.error { background: var(--danger); }
.toast.info { background: var(--primary); }
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
}
.modal {
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    box-shadow: var(--shadow-lg);
}
.modal h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
}
.modal p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}
.modal-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}
'@ | Set-Content -Path "frontend\css\style.css" -Encoding UTF8

# ======================================================================
# 2. AUTH STYLES (auth.css)
# ======================================================================
@'
.auth-form {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
}
.auth-form h2 {
    margin-top: 0;
    text-align: center;
    margin-bottom: 1.5rem;
}
.auth-form input {
    margin-bottom: 1rem;
}
.auth-form button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
}
.auth-form .form-footer {
    text-align: center;
    margin-top: 1rem;
}
'@ | Set-Content -Path "frontend\css\auth.css" -Encoding UTF8

# ======================================================================
# 3. DASHBOARD STYLES (dashboard.css)
# ======================================================================
@'
/* Dashboard containers */
.dashboard-container {
    background: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    padding: 1.5rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
}
.stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--shadow-xs);
}
.stat-card .label {
    font-size: 0.875rem;
    color: var(--text-muted);
    font-weight: 500;
    margin-bottom: 0.5rem;
}
.stat-card .value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
}
.stat-card .sub {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
}

/* Quick action */
.quick-action {
    margin-bottom: 2rem;
}

/* Link table */
.link-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--surface);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
}
.link-table thead th {
    background: #F1F5F9;
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
    padding: 0.9rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border);
}
.link-table tbody td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
}
.link-table tbody tr {
    transition: background-color var(--transition);
}
.link-table tbody tr:hover {
    background-color: #F8FAFC;
}
.link-table tbody tr:last-child td {
    border-bottom: none;
}

/* Action cell */
.link-table tbody td.link-actions-cell {
    text-align: center;
}
.link-actions {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: auto;
}

/* Buttons inside actions */
.link-actions .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: all var(--transition);
    margin: 0;
    cursor: pointer;
    border: 1.5px solid transparent;
    min-height: 40px;
    line-height: normal;
    text-align: center;
    white-space: nowrap;
}
.link-actions .btn-outline {
    border-color: var(--primary);
    color: var(--primary);
    background: transparent;
}
.link-actions .btn-outline:hover {
    background: var(--primary-light);
    color: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-xs);
}
.link-actions .btn-danger-outline {
    border-color: var(--danger);
    color: var(--danger);
    background: transparent;
}
.link-actions .btn-danger-outline:hover {
    background: var(--danger-light);
    color: var(--danger);
    transform: translateY(-1px);
    box-shadow: var(--shadow-xs);
}

/* Responsive: Mobile (<600px) */
@media (max-width: 600px) {
    .stats-grid {
        grid-template-columns: 1fr 1fr;
    }
    .link-table {
        border: none;
        box-shadow: none;
        background: transparent;
    }
    .link-table thead {
        display: none;
    }
    .link-table tbody {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .link-table tbody tr {
        display: block;
        background: var(--surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--border);
        padding: 1rem;
        margin-bottom: 0;
    }
    .link-table tbody td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: right;
        padding: 0.6rem 0;
        border: none;
        border-bottom: 1px solid var(--border);
    }
    .link-table tbody td:last-child {
        border-bottom: none;
    }
    .link-table tbody td::before {
        content: attr(data-label);
        font-weight: 600;
        text-align: left;
        color: var(--text-muted);
        margin-right: 1rem;
        flex-shrink: 0;
    }
    .link-table tbody td.link-actions-cell {
        display: block;
        text-align: left;
        padding-top: 0.8rem;
    }
    .link-table tbody td.link-actions-cell::before {
        display: none;
    }
    .link-actions {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        margin: 0;
    }
    .link-actions .btn {
        width: 100%;
        margin: 0;
    }
}
'@ | Set-Content -Path "frontend\css\dashboard.css" -Encoding UTF8

# ======================================================================
# 4. RESPONSIVE CSS (responsive.css)
# ======================================================================
@'
/* Global responsive adjustments */
@media (max-width: 768px) {
    header {
        padding: 0 1rem;
        height: auto;
        min-height: 64px;
    }
    nav {
        display: none;
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        background: var(--surface);
        flex-direction: column;
        padding: 1rem;
        gap: 0.25rem;
        border-bottom: 1px solid var(--border);
        box-shadow: var(--shadow);
    }
    nav.open {
        display: flex;
    }
    nav a, nav button {
        width: 100%;
        text-align: left;
        padding: 0.75rem 1rem;
        border-radius: var(--radius-md);
    }
    .menu-toggle {
        display: block;
    }
    main {
        margin: 1rem auto;
        padding: 0 1rem;
    }
    h1 { font-size: 1.5rem; }
    h2 { font-size: 1.3rem; }
}
'@ | Set-Content -Path "frontend\css\responsive.css" -Encoding UTF8

# ======================================================================
# 5. UI HELPER JS (ui.js)
# ======================================================================
@'
// UI helpers: mobile nav, toast, delete modal, copy
document.addEventListener('DOMContentLoaded', function() {
    // Mobile nav toggle
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
        // Close menu on link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => nav.classList.remove('open'));
        });
    }
});

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) {
        const div = document.createElement('div');
        div.id = 'toast-container';
        document.body.appendChild(div);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
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
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard!', 'success');
    });
}
'@ | Set-Content -Path "frontend\js\ui.js" -Encoding UTF8

# ======================================================================
# 6. LANDING PAGE (index.html)
# ======================================================================
@'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LinkPulse - Smart URL Management & Analytics</title>
    <link rel="stylesheet" href="/static/css/style.css?v=5">
    <link rel="stylesheet" href="/static/css/responsive.css?v=5">
</head>
<body>
    <header>
        <a href="/" class="logo">LinkPulse</a>
        <nav id="main-nav">
            <a href="/">Home</a>
            <a href="/login/">Login</a>
            <a href="/register/" class="btn btn-outline">Get Started</a>
        </nav>
    </header>
    <main>
        <section class="hero" style="text-align:center; padding: 4rem 0 2rem;">
            <div class="badge badge-primary" style="background:var(--primary-light); color:var(--primary); margin-bottom:1rem;">Simple links. Powerful analytics.</div>
            <h1 style="font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom:1rem;">Short links that tell you<br>what happens next.</h1>
            <p style="font-size:1.2rem; color:var(--text-secondary); max-width:600px; margin:0 auto 2rem;">
                Create branded short links, share them anywhere, and get real-time analytics on clicks, devices, and referrers.
            </p>
            <div class="hero-actions" style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
                <a href="/register/" class="btn btn-lg">Create your first link</a>
                <a href="/dashboard/" class="btn btn-outline btn-lg">Explore Dashboard</a>
            </div>
        </section>
        <section class="product-preview" style="margin-top:3rem;">
            <div class="card" style="max-width:800px; margin:0 auto;">
                <h3 style="margin-bottom:1rem;">LinkPulse Dashboard</h3>
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:1rem; margin-bottom:1.5rem;">
                    <div><div class="text-muted" style="font-size:0.875rem;">Total Clicks</div><div style="font-size:2rem; font-weight:700;">12,480</div></div>
                    <div><div class="text-muted" style="font-size:0.875rem;">Active Links</div><div style="font-size:2rem; font-weight:700;">36</div></div>
                    <div><div class="text-muted" style="font-size:0.875rem;">Clicks Today</div><div style="font-size:2rem; font-weight:700;">1,248</div></div>
                    <div><div class="text-muted" style="font-size:0.875rem;">Top Link</div><div style="font-size:1.2rem; font-weight:600;">/python-course</div></div>
                </div>
                <div style="text-align:center; color:var(--text-muted); font-size:0.9rem;">Sample dashboard preview</div>
            </div>
        </section>
        <section style="margin-top:4rem; text-align:center;">
            <h3>Why LinkPulse?</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.5rem; margin-top:2rem;">
                <div class="card">
                    <h4>⚡ Fast Redirects</h4>
                    <p>Custom short codes that redirect instantly.</p>
                </div>
                <div class="card">
                    <h4>📊 Click Analytics</h4>
                    <p>Track browser, device, and referrer.</p>
                </div>
                <div class="card">
                    <h4>🔒 Private Links</h4>
                    <p>Each user can only manage their own links.</p>
                </div>
            </div>
        </section>
    </main>
    <script src="/static/js/ui.js"></script>
    <script>
        // Adjust nav based on login state
        const token = localStorage.getItem('token');
        const nav = document.getElementById('main-nav');
        if (token) {
            nav.innerHTML = `
                <a href="/">Home</a>
                <a href="/dashboard/">Dashboard</a>
                <a href="#" id="landing-logout">Logout</a>
            `;
            document.getElementById('landing-logout').addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                window.location.href = '/login/';
            });
        }
    </script>
</body>
</html>
'@ | Set-Content -Path "frontend\index.html" -Encoding UTF8

# ======================================================================
# 7. DASHBOARD PAGE (dashboard.html)
# ======================================================================
@'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - LinkPulse</title>
    <link rel="stylesheet" href="/static/css/style.css?v=5">
    <link rel="stylesheet" href="/static/css/dashboard.css?v=5">
    <link rel="stylesheet" href="/static/css/responsive.css?v=5">
</head>
<body>
    <header>
        <a href="/" class="logo">LinkPulse</a>
        <nav>
            <a href="/dashboard/" class="active">Dashboard</a>
            <a href="/create-link/">Create Link</a>
            <a href="/analytics/">Analytics</a>
            <a href="/profile/">Profile</a>
            <a href="#" id="logout-btn">Logout</a>
        </nav>
    </header>
    <main>
        <div class="dashboard-header flex items-center justify-between mb-3">
            <div>
                <h1 style="margin:0;">Good morning, <span id="welcome-user"></span></h1>
                <p class="text-muted" style="margin:0;">Here's what's happening with your links.</p>
            </div>
            <a href="/create-link/" class="btn btn-primary">+ Create Link</a>
        </div>
        <div class="stats-grid" id="stats-container">
            <!-- Stats cards will be inserted by JS -->
        </div>
        <h2>My Links</h2>
        <div id="links-container">Loading your links...</div>
    </main>
    <script src="/static/js/api.js"></script>
    <script src="/static/js/ui.js"></script>
    <script src="/static/js/dashboard.js"></script>
</body>
</html>
'@ | Set-Content -Path "frontend\pages\dashboard.html" -Encoding UTF8

# ======================================================================
# 8. DASHBOARD JS (dashboard.js)
# ======================================================================
@'
document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token) {
        window.location.href = '/login/';
        return;
    }

    document.getElementById('welcome-user').textContent = username || 'there';

    // Load analytics stats
    try {
        const analytics = await apiRequest('/analytics/', 'GET');
        renderStats(analytics);
    } catch (error) {
        console.error('Failed to load analytics', error);
        document.getElementById('stats-container').innerHTML = '<div class="text-muted">Could not load statistics.</div>';
    }

    // Load links
    try {
        const data = await apiRequest('/links/', 'GET');
        renderLinks(data);
    } catch (error) {
        document.getElementById('links-container').textContent = 'Failed to load links.';
    }

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async function(e) {
        e.preventDefault();
        try {
            await apiRequest('/auth/logout/', 'POST');
        } catch (err) {
            // ignore
        }
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login/';
    });
});

function renderStats(analytics) {
    const container = document.getElementById('stats-container');
    container.innerHTML = `
        <div class="stat-card">
            <div class="label">Total Links</div>
            <div class="value">${analytics.total_links}</div>
        </div>
        <div class="stat-card">
            <div class="label">Total Clicks</div>
            <div class="value">${analytics.total_clicks}</div>
        </div>
        <div class="stat-card">
            <div class="label">Active Links</div>
            <div class="value">${analytics.active_links}</div>
        </div>
        <div class="stat-card">
            <div class="label">Expired Links</div>
            <div class="value">${analytics.expired_links}</div>
        </div>
    `;
}

function renderLinks(links) {
    const container = document.getElementById('links-container');
    if (!links || links.length === 0) {
        container.innerHTML = `
            <div class="card text-center" style="padding:3rem 1rem;">
                <h3>No links yet</h3>
                <p class="text-muted">Create your first short link and start tracking its performance.</p>
                <a href="/create-link/" class="btn btn-primary mt-2">+ Create Link</a>
            </div>
        `;
        return;
    }

    let html = '<table class="link-table"><thead><tr><th>Short Code</th><th>Original URL</th><th>Status</th><th>Clicks</th><th>Actions</th></tr></thead><tbody>';
    links.forEach(link => {
        const statusBadge = link.is_active ? (link.is_expired ? '<span class="badge badge-warning">Expired</span>' : '<span class="badge badge-success">Active</span>') : '<span class="badge badge-danger">Disabled</span>';
        html += `<tr>
            <td data-label="Short Code">${link.short_code}</td>
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
}

async function deleteLink(id) {
    confirmDelete(async () => {
        try {
            await apiRequest(`/links/${id}/`, 'DELETE');
            showToast('Link deleted successfully', 'success');
            setTimeout(() => location.reload(), 500);
        } catch (error) {
            showToast('Unable to delete link', 'error');
        }
    });
}
'@ | Set-Content -Path "frontend\js\dashboard.js" -Encoding UTF8

# ======================================================================
# 9. CREATE LINK PAGE (create-link.html) - basic update with success UI
# ======================================================================
@'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Link - LinkPulse</title>
    <link rel="stylesheet" href="/static/css/style.css?v=5">
    <link rel="stylesheet" href="/static/css/auth.css?v=5">
    <link rel="stylesheet" href="/static/css/responsive.css?v=5">
</head>
<body>
    <header>
        <a href="/" class="logo">LinkPulse</a>
        <nav>
            <a href="/dashboard/">Dashboard</a>
            <a href="#" id="logout-btn">Logout</a>
        </nav>
    </header>
    <main>
        <h1>Create a short link</h1>
        <form id="create-link-form" class="card" style="max-width:500px; margin:2rem auto;">
            <div class="form-group">
                <label for="original_url">Destination URL</label>
                <input type="url" id="original_url" placeholder="https://example.com/..." required>
            </div>
            <div class="form-group">
                <label for="short_code">Custom alias (optional)</label>
                <input type="text" id="short_code" placeholder="my-link">
                <div class="form-hint">Leave blank for auto-generated code.</div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%;">Create Link</button>
            <div id="message" class="mt-2"></div>
        </form>
        <div id="success-state" class="card" style="display:none; max-width:500px; margin:2rem auto; text-align:center;">
            <h2>Your short link is ready!</h2>
            <p id="new-short-url" style="font-size:1.2rem; font-weight:600;"></p>
            <div class="flex gap-1" style="justify-content:center;">
                <button class="btn btn-outline" onclick="copyToClipboard(document.getElementById('new-short-url').textContent)">Copy</button>
                <a href="#" id="open-link" class="btn btn-primary" target="_blank">Open</a>
            </div>
        </div>
    </main>
    <script src="/static/js/api.js"></script>
    <script src="/static/js/ui.js"></script>
    <script src="/static/js/links.js"></script>
</body>
</html>
'@ | Set-Content -Path "frontend\pages\create-link.html" -Encoding UTF8

# ======================================================================
# 10. UPDATE links.js TO HANDLE SUCCESS STATE
# ======================================================================
@'
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
'@ | Set-Content -Path "frontend\js\links.js" -Encoding UTF8

# ======================================================================
# 11. OTHER PAGES: Add UI JS and update headers (auth pages)
# ======================================================================
# We'll add ui.js to all pages for mobile nav and toasts.
Get-ChildItem "frontend\pages\*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    # Add ui.js before </body> if not already
    if ($content -notmatch 'ui\.js') {
        $content = $content -replace '</body>', '<script src="/static/js/ui.js"></script></body>'
    }
    Set-Content $_.FullName $content -Encoding UTF8
}
# Add cache-busting to CSS/JS links across all pages
Get-ChildItem "frontend\pages\*.html", "frontend\index.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'href="/static/css/style\.css"', 'href="/static/css/style.css?v=5"'
    $content = $content -replace 'href="/static/css/auth\.css"', 'href="/static/css/auth.css?v=5"'
    $content = $content -replace 'href="/static/css/dashboard\.css"', 'href="/static/css/dashboard.css?v=5"'
    $content = $content -replace 'href="/static/css/responsive\.css"', 'href="/static/css/responsive.css?v=5"'
    $content = $content -replace 'src="/static/js/ui\.js"', 'src="/static/js/ui.js?v=5"'
    Set-Content $_.FullName $content -Encoding UTF8
}

Write-Host "UI Overhaul Complete!"
'@
