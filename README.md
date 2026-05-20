# DevBoard

**DevBoard** is a full-stack developer project management and portfolio platform.

Track projects and tasks, import repositories from GitHub, view dashboard analytics, and share a public portfolio page — all secured with JWT authentication and a modern dark UI.

🌐 **Live Demo:** https://devboard-frontend-tfj8.onrender.com  
🔗 **Backend API:** https://devboard-backend-uoj6.onrender.com/api  
📂 **Repository:** https://github.com/dheeraj25406/devboard

---

## Highlights (Resume-Ready)

- Architected a **REST API** using Django REST Framework with **JWT authentication** (register, login, refresh, profile).
- Built complete **CRUD workflows** for projects and tasks with filtering, search, status, and priority controls.
- Developed a **dashboard analytics system** to summarize project and task activity.
- Integrated the **GitHub public API** for repository discovery and one-click project import.
- Built a **React + Vite SPA** with protected routes, token refresh handling, reusable components, and validation.
- Designed a modern **dark portfolio UI** with responsive layouts and glass-style cards.
- Configured production deployment with **environment-based configuration** and Render hosting.
- Included **Postman API collection** and reproducible local setup.

---

# Architecture

```text
Frontend (React + Vite)
        ↓
Axios + JWT Authentication
        ↓
Django REST API
        ↓
Database

GitHub API
        ↓
Repository Import
```

---

# Features

| Area | Capabilities |
|------|----------------|
| Authentication | Register, Login, JWT Refresh, Profile |
| Projects | Create, Update, Delete, Filter, Search |
| Tasks | CRUD with status and priority |
| Dashboard | Analytics and summaries |
| GitHub | Import repositories |
| Portfolio | Public developer showcase |
| UI | Responsive dark interface |

---

# Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Python, Django 4.2, Django REST Framework |
| Authentication | JWT (SimpleJWT) |
| Database | SQLite (development), production-ready database configuration |
| API Testing | Postman |
| Deployment | Render |
| Version Control | Git / GitHub |

---

# Screenshots

## Dashboard

Overview of projects and tasks.

![Dashboard](screenshots/Dashboard.png)

---

## Projects

Project browsing, filtering, and management.

![Projects](screenshots/Projects.png)

---

## Task Management

Manage tasks with status and priorities.

![Add task](screenshots/Add%20task.png)

---

## GitHub Import

Import repositories directly into DevBoard.

![GitHub Import](screenshots/GitHub%20Import.png)

---

# Quick Start

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm
- Git

---

## Clone Repository

```bash
git clone https://github.com/dheeraj25406/devboard.git
cd DevBoard
```

---

## Backend Setup

```bash
cd backend

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env

python manage.py migrate

python manage.py createsuperuser

python manage.py runserver
```

Backend:

```text
http://localhost:8000/api
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend

npm install

cp .env.example .env

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Try It

1. Register
2. Login
3. Create project
4. Add tasks
5. Import GitHub repo
6. Open public portfolio

```text
/dev/<username>
```

---

# Environment Variables

## Backend (.env)

| Variable | Description |
|----------|-------------|
| SECRET_KEY | Django secret |
| DEBUG | Debug mode |
| ALLOWED_HOSTS | Allowed hosts |
| CORS_ALLOWED_ORIGINS | Allowed frontend |
| CSRF_TRUSTED_ORIGINS | Trusted frontend |

Example:

```env
SECRET_KEY=secret

DEBUG=True

ALLOWED_HOSTS=localhost,127.0.0.1

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

## Frontend (.env)

| Variable | Description |
|----------|-------------|
| VITE_API_BASE_URL | Backend URL |

Example:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

# API Endpoints

## Authentication

```text
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
GET  /api/auth/me/
PUT  /api/auth/profile/
```

---

## Projects

```text
GET
POST
PUT
PATCH
DELETE
/api/projects/
```

---

## Tasks

```text
GET
POST
PUT
PATCH
DELETE
/api/tasks/
```

---

## Dashboard

```text
GET /api/dashboard/stats/
```

---

## GitHub

```text
GET  /api/github/repos/
POST /api/github/import/
```

---

# Example Register Request

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
-H "Content-Type: application/json" \
-d '{
"username":"demo",
"email":"demo@gmail.com",
"password":"Password123!"
}'
```

---

# Folder Structure

```text
DevBoard
│
├── backend
│   ├── accounts
│   ├── projects
│   ├── github_sync
│   ├── devboard_backend
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   └── utils
│
├── screenshots
│
├── postman
│
└── README.md
```

---

# Deployment

Frontend:

https://devboard-frontend-tfj8.onrender.com

Backend:

https://devboard-backend-uoj6.onrender.com

Hosting:

- Render (Frontend)
- Render (Backend)

---

# Future Improvements

- [ ] PostgreSQL migration
- [ ] GitHub OAuth
- [ ] Email verification
- [ ] Password reset
- [ ] Real-time updates
- [ ] Docker support
- [ ] CI/CD pipelines
- [ ] Unit and integration tests
- [ ] Custom portfolio domains

---

# License

MIT
