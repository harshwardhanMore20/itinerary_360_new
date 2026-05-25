# Itinerary 360 — Backend API

Production-ready FastAPI backend for the Itinerary 360 Maharashtra travel guide.

## Stack

| Layer | Technology |
|-------|-----------|
| Language | Python 3.11+ |
| Framework | FastAPI |
| Database | MySQL 8.x |
| ORM | SQLAlchemy 2.0 |
| Migrations | Alembic |
| Auth | JWT (python-jose) |
| Passwords | bcrypt (passlib) |
| Validation | Pydantic v2 |

---

## Project Structure

```
itinerary360-backend/
├── app/
│   ├── main.py              # FastAPI app factory + startup
│   ├── database.py          # Engine, session, Base
│   ├── models/
│   │   └── user.py          # SQLAlchemy User model
│   ├── schemas/
│   │   └── user.py          # Pydantic request/response schemas
│   ├── routes/
│   │   ├── auth.py          # POST /auth/signup, /auth/login, /auth/logout
│   │   └── profile.py       # GET/PATCH /profile
│   ├── services/
│   │   └── user_service.py  # Business logic — all DB queries here
│   ├── auth/
│   │   └── jwt_handler.py   # Token creation, verification, revocation
│   ├── config/
│   │   └── settings.py      # Pydantic Settings — reads .env
│   └── utils/
│       └── security.py      # Password hashing helpers
├── alembic/
│   ├── env.py
│   └── versions/
│       └── 001_create_users.py
├── frontend-integration/
│   └── auth.js              # Drop into your js/ folder
├── .env.example
├── alembic.ini
├── requirements.txt
└── README.md
```

---

## Quick Start

### 1. Clone and create virtual environment

```bash
cd itinerary360-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Create MySQL database

```sql
CREATE DATABASE itinerary360 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'i360user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON itinerary360.* TO 'i360user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your DB credentials and a strong JWT_SECRET_KEY
```

Generate a secure JWT secret:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 4. Run database migrations

```bash
alembic upgrade head
```

### 5. Start the server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Visit:
- **Interactive docs:** http://127.0.0.1:8000/docs
- **ReDoc:** http://127.0.0.1:8000/redoc
- **Health check:** http://127.0.0.1:8000/health

---

## API Reference

### Authentication

#### `POST /auth/signup`
Register a new account.

**Request body:**
```json
{
  "username": "traveller123",
  "email": "user@example.com",
  "password": "SecurePass1",
  "location": "Pune, Maharashtra"
}
```

**Response 201:**
```json
{
  "message": "Account created successfully. Welcome to Itinerary 360!",
  "user": { "id": 1, "username": "traveller123", "email": "user@example.com", ... },
  "token": { "access_token": "eyJ...", "token_type": "bearer", "expires_in": 3600 }
}
```

---

#### `POST /auth/login`
Log in with username **or** email.

**Request body:**
```json
{
  "identifier": "traveller123",
  "password": "SecurePass1"
}
```

---

#### `POST /auth/logout`
Revoke the current token. Requires `Authorization: Bearer <token>` header.

---

### Profile (protected — requires Bearer token)

#### `GET /profile`
Returns the logged-in user's profile data. Never exposes `password_hash`.

#### `PATCH /profile`
Update any combination of `username`, `email`, `location`, `password`.

---

## Frontend Integration

Copy `frontend-integration/auth.js` into your project's `js/` folder.

### Update login.html

Replace the commented-out redirect in your form submit handler:

```javascript
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const pw    = document.getElementById('password').value;
    const errEl = document.getElementById('errorMsg');

    if (!email || !pw) {
        errEl.textContent = 'Please fill in both fields.';
        errEl.classList.add('show');
        return;
    }

    try {
        await Auth.login(email, pw);
        window.location.href = 'profile.html';
    } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.add('show');
    }
});
```

Also add `<script src="../js/auth.js"></script>` before your inline script.

### Update profile.html

Replace the static `init()` function content:

```javascript
async function init() {
    Auth.requireAuth();                    // redirect to login if not logged in

    try {
        const user = await Auth.getProfile();
        document.getElementById('fieldUsername').textContent = user.username;
        document.getElementById('fieldEmail').textContent    = user.email;
        document.getElementById('location').textContent     = user.location || 'Not set';
    } catch (err) {
        console.error('Failed to load profile:', err);
    }

    updateCount();
    window.addEventListener('wishlistUpdated', () => {
        const panel = document.getElementById('panel-wishlist');
        if (panel.classList.contains('active')) renderWishlist();
        updateCount();
    });
}
```

Update the logout button:
```javascript
// Replace: onclick="window.location.href='login.html'"
// With:
async function handleLogout() {
    await Auth.logout();
    window.location.href = 'login.html';
}
```

### Add signup support

Add `<script src="../js/auth.js"></script>` and update the "Create one free →" link to point to a `signup.html` page, or add a toggle to the existing login form.

---

## Password Requirements

- Minimum 8 characters
- At least one letter
- At least one digit

---

## Security Notes

- Passwords are **never stored in plaintext** — bcrypt with automatic salting
- JWT tokens are signed with HS256 and expire after 60 minutes (configurable)
- Logged-out tokens are stored in an in-memory revocation set — swap for **Redis** in production for persistence across restarts
- All sensitive config is in `.env` — never commit this file
- SQL injection is impossible via SQLAlchemy ORM
- User enumeration is prevented by constant-time password comparison even for non-existent users
- CORS is restricted to `ALLOWED_ORIGINS` from `.env`
