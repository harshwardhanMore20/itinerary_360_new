# Itinerary 360

Itinerary 360 is a travel planning and destination discovery website for Maharashtra, India. The project combines a static frontend experience with a FastAPI-based authentication and profile backend so users can browse destinations, save wishlists, and manage accounts securely.

The app is designed for travel inspiration, local discovery, and simple user account flows. It includes a curated destination catalogue, destination detail pages, wishlist support, and a backend API for signup, login, profile management, and JWT-based authentication.

## Project Overview

This repository contains two main parts:

- Frontend: static site built with HTML, CSS, and JavaScript in the [frontend/](frontend/) folder
- Backend: FastAPI application in the [backend/](backend/) folder with SQLAlchemy, MySQL, JWT authentication, and Alembic migrations

## Features

- Maharashtra destination discovery homepage with search and category filters
- Destination detail pages for beaches, hill stations, forts, and spiritual locations
- Wishlist functionality with browser storage
- Dark mode support
- User signup and login flow
- JWT-based protected profile access
- Profile update support
- MySQL-backed user persistence
- Alembic migration support for schema changes

## Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Local storage for wishlist/session persistence

### Backend
- Python 3.11+
- FastAPI
- SQLAlchemy 2
- MySQL
- Alembic
- Pydantic v2
- JWT with python-jose
- bcrypt / passlib for password hashing
- Redis support for optional token revocation

## Repository Structure

```text
itinerary360/
├── README.md
├── backend/
│   ├── README.md
│   ├── alembic.ini
│   ├── env.example
│   ├── requirements.txt
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   └── jwt_handler.py
│   │   ├── config/
│   │   │   ├── __init__.py
│   │   │   └── settings.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── user.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   └── profile.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── user.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── user_service.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── security.py
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   │       ├── 001_create_users.py
│   │       ├── 002_add_fullname_phone_to_users.py
│   │       └── 002_add_token_version.py
│   └── frontend-integration/
│       └── auth.js
├── frontend/
│   ├── assets/
│   ├── components/
│   ├── destinations/
│   ├── js/
│   │   ├── auth.js
│   │   ├── darkmode.js
│   │   ├── destination-builder.js
│   │   ├── navbar.js
│   │   └── wishlist.js
│   ├── pages/
│   │   ├── about.html
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── profile.html
│   │   └── signup.html
│   └── styles/
│       ├── index.css
│       ├── login.css
│       ├── main.css
│       └── profile.css
└── tmp/
    └── wheel files used during environment setup
```

## Backend Setup

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

On Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

On macOS/Linux:

```bash
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Copy the sample environment file and update it with your local database and JWT information.

```bash
copy env.example .env
```

Then edit the file and set values like these:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=itinerary360
DB_USER=root
DB_PASSWORD=your_db_password
JWT_SECRET_KEY=replace-with-a-long-random-secret-key
REDIS_URL=redis://localhost:6379/0
APP_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:5500,http://localhost:5500
```

Generate a secure JWT secret:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 5. Create MySQL database

In MySQL:

```sql
CREATE DATABASE itinerary360 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then ensure the DB user has access to that database.

### 6. Run database migrations

```bash
alembic upgrade head
```

### 7. Start the API server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

- http://127.0.0.1:8000/docs
- http://127.0.0.1:8000/redoc
- http://127.0.0.1:8000/health

## Frontend Setup

The frontend is a static site and does not require a build step. To run it locally:

1. Open the project in a browser from the frontend folder, or use a simple local static server.
2. If using VS Code Live Server or Python HTTP server, serve the [frontend/](frontend/) directory.

Example:

```bash
cd frontend
python -m http.server 5500
```

Then open:

- http://127.0.0.1:5500/pages/index.html

## Authentication Flow

The backend exposes authentication endpoints under the `/auth` prefix.

### Signup

```http
POST /auth/signup
```

Request body:

```json
{
  "username": "traveller123",
  "email": "user@example.com",
  "password": "SecurePass1",
  "full_name": "Jane Doe",
  "location": "Pune, Maharashtra",
  "phone_number": "9876543210"
}
```

### Login

```http
POST /auth/login
```

Request body:

```json
{
  "identifier": "traveller123",
  "password": "SecurePass1"
}
```

The backend validates the username/email and returns a JWT access token.

### Profile

Protected endpoints require a Bearer token:

```http
GET /profile
PATCH /profile
```

### Logout

```http
POST /auth/logout
```

The logout route invalidates the current token and ends the user session.

## API Endpoints

### Authentication

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`

### Profile

- `GET /profile`
- `PATCH /profile`

### Health

- `GET /health`

## Frontend Integration Notes

The frontend JS file [frontend/js/auth.js](frontend/js/auth.js) is configured to connect to the backend at:

```javascript
const BASE_URL = 'http://127.0.0.1:8000';
```

If you deploy the backend to a different host or port, update this value accordingly.

The frontend uses localStorage to store:

- JWT token
- authenticated user info

This allows the website to protect pages like profile navigation and session-based access.

## Database and Models

The main user model is defined in [backend/app/models/user.py](backend/app/models/user.py). It stores:

- `id`
- `full_name`
- `username`
- `email`
- `phone_number`
- `password_hash`
- `token_version`
- `location`
- `is_active`
- `created_at`
- `updated_at`

## Security Notes

- Passwords are hashed using bcrypt before they are stored.
- JWTs are signed using HS256.
- Profile routes require authentication.
- Sensitive runtime configuration should be stored in `.env` and never committed to source control.
- The default secret in configuration should be replaced in production.

## Development Notes

- The FastAPI app automatically creates database tables during startup in development mode.
- For production, Alembic migrations are the recommended approach.
- Frontend is intentionally lightweight and not framework-based, which keeps the project easy to understand and quick to run.

## Common Troubleshooting

### CORS errors

If the browser complains about CORS:

- verify the backend is running
- confirm `ALLOWED_ORIGINS` includes the frontend origin
- restart the FastAPI app after changing environment values

### Database connection errors

Check:

- MySQL service is running
- DB credentials in `.env` are correct
- database exists and is accessible

### JWT errors

Check:

- `JWT_SECRET_KEY` is set and long enough
- token is sent in the `Authorization: Bearer <token>` header
- the token has not been revoked or expired

## Recommended Local Workflow

1. Start MySQL.
2. Configure backend `.env`.
3. Run `alembic upgrade head`.
4. Start the FastAPI server on port 8000.
5. Serve the frontend on port 5500.
6. Open the homepage and test signup/login.

## License

This project is intended for educational and personal travel application use. If you are deploying it publicly, review license compatibility for any third-party assets or libraries before production use.

## Summary

Itinerary 360 is a full-stack travel website that demonstrates a simple but useful architecture:

- static site for browsing destinations
- FastAPI backend for secure user auth and profile features
- MySQL for persistence
- JWT and bcrypt for secure account handling

This makes the project a good starting point for a portfolio application, travel website prototype, or full-stack learning project.
