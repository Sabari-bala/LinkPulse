# LinkPulse — Smart URL Management & Analytics

LinkPulse is a full-stack SaaS-style URL shortener and analytics platform built with **Django REST Framework** and **Vanilla JavaScript**.

It allows users to create short links, share them, manage them, and track useful click analytics.

---

## 🚀 Features

* User registration, login, and logout
* Token-based authentication
* Create short links with optional custom aliases
* Automatic short code generation
* Edit, enable/disable, and delete links
* Link expiration dates
* Backend redirect system with validation
* Click tracking
* Browser information
* Device category
* Operating system
* Referrer information
* Dashboard statistics
* Total links
* Total clicks
* Active links
* Expired links
* Per-link analytics
* Recent click activity
* Responsive frontend for desktop, tablet, and mobile
* REST API for core functionality
* Automated tests covering authentication, links, redirects, and analytics

---

## 🛠️ Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* SQLite for development
* PostgreSQL-ready production configuration

### Frontend

* HTML5
* CSS3
* CSS Variables
* Responsive CSS
* Vanilla JavaScript

### Tools

* Git
* GitHub
* Environment Variables

---

## 📁 Project Structure

```text
LinkPulse/
│
├── backend/
│   │
│   ├── apps/
│   │   ├── users/
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── tests.py
│   │   │
│   │   ├── links/
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── tests.py
│   │   │
│   │   ├── analytics/
│   │   │   ├── models.py
│   │   │   ├── utils.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── tests.py
│   │   │
│   │   └── core/
│   │       ├── views.py
│   │       └── urls.py
│   │
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── requirements/
│   │   ├── base.txt
│   │   ├── development.txt
│   │   └── production.txt
│   │
│   └── manage.py
│
├── frontend/
│   ├── index.html
│   │
│   ├── pages/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   ├── create-link.html
│   │   ├── link-details.html
│   │   ├── analytics.html
│   │   └── profile.html
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── links.js
│   │   ├── analytics.js
│   │   ├── link-details.js
│   │   ├── profile.js
│   │   └── ui.js
│   │
│   └── images/
│
├── docs/
│
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🔌 REST API Endpoints

| Method    | Endpoint                    | Description                               |
| --------- | --------------------------- | ----------------------------------------- |
| POST      | `/api/auth/register/`       | Register a new user                       |
| POST      | `/api/auth/login/`          | Login user                                |
| POST      | `/api/auth/logout/`         | Logout user                               |
| GET       | `/api/links/`               | List current user's links                 |
| POST      | `/api/links/`               | Create a new link                         |
| GET       | `/api/links/<id>/`          | Retrieve link details                     |
| PUT/PATCH | `/api/links/<id>/`          | Update link                               |
| DELETE    | `/api/links/<id>/`          | Delete link                               |
| GET       | `/api/analytics/`           | Dashboard analytics summary               |
| GET       | `/api/analytics/<link_id>/` | Per-link analytics                        |
| GET       | `/<short_code>/`            | Redirect to original URL and record click |

---

## 🗄️ Database Models

### Profile

One-to-One relationship with the Django User.

Stores additional user profile information.

### Link

Stores information about shortened URLs.

Main fields include:

* Original URL
* Short code
* Custom alias
* Active status
* Expiration date
* Owner
* Creation timestamp

### Click

Stores analytics information for each link click.

Main fields include:

* Link
* Click timestamp
* Referrer
* Browser
* Device category
* Operating system

---

## 🔄 How LinkPulse Works

The core redirect flow is:

```text
Visitor
   ↓
Short URL
   ↓
Django Redirect View
   ↓
Find Short Code
   ↓
Check Link Exists
   ↓
Check Active Status
   ↓
Check Expiration
   ↓
Record Click Analytics
   ↓
Redirect to Original URL
```

For example:

```text
https://linkpulse.com/a8K92x
```

can redirect to:

```text
https://example.com/python-course
```

while recording the click for analytics.

---

## 📊 Analytics

LinkPulse records useful information about link activity.

Depending on the available request information, analytics may include:

* Total clicks
* Click timestamp
* Referrer
* Browser
* Device category
* Operating system

The dashboard provides a high-level view of link performance, while individual link analytics provide more detailed click activity.

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sabari-bala/LinkPulse.git
cd LinkPulse
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

#### Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

#### Windows Command Prompt

```cmd
venv\Scripts\activate
```

#### macOS / Linux

```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
cd backend
python -m pip install -r requirements/development.txt
```

### 5. Configure environment variables

Copy `.env.example` to `.env`.

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

For macOS / Linux:

```bash
cp .env.example .env
```

Update the `.env` file with the required configuration.

**Never commit `.env` or other secrets to GitHub.**

### 6. Run database migrations

```bash
python manage.py migrate
```

### 7. Start the development server

```bash
python manage.py runserver
```

### 8. Open LinkPulse

Visit:

```text
http://127.0.0.1:8000/
```

---

## 🧪 Running Tests

From the `backend` directory:

```bash
python manage.py test
```

The project currently contains automated tests covering important areas such as:

* Authentication
* Link creation and management
* Authorization
* Redirect behavior
* Expiration handling
* Click tracking
* Analytics

---

## 🔐 Security

LinkPulse follows basic web application security practices, including:

* Password hashing through Django authentication
* Authentication and authorization
* User-specific resource permissions
* Backend validation
* URL validation
* CSRF protection where applicable
* Environment-based secret configuration
* Production-specific settings
* Secure handling of sensitive configuration

Secrets and credentials should never be committed to the repository.

---

## 📱 Responsive Design

The frontend is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The dashboard and other pages use responsive layouts so that important information and actions remain accessible on smaller screens.

---

## 🚧 Future Improvements

Potential future improvements include:

* Advanced analytics charts
* Privacy-conscious geographic analytics
* QR code generation
* UTM campaign tracking
* Rate limiting
* API keys
* Production deployment
* PostgreSQL deployment
* Docker-based deployment
* Additional automated tests

These features are intentionally kept separate from the core application to avoid unnecessary complexity.

---

## 📌 Project Status

LinkPulse is a portfolio-focused full-stack project built to demonstrate practical skills in:

* Python
* Django
* Django REST Framework
* SQL and relational databases
* HTML
* CSS
* JavaScript
* REST API development
* Authentication and authorization
* Backend business logic
* Analytics
* Responsive UI/UX
* Testing
* Git and GitHub

---

## 📄 License

This project is open-source and available under the **MIT License**.
