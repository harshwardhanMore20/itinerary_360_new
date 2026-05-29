from fastapi.testclient import TestClient
from uuid import uuid4

from app.main import app

client = TestClient(app)


def run_test():
    unique = uuid4().hex[:8]
    email = f"test_{unique}@example.com"
    username = f"user_{unique}"
    password = "Password1!"

    signup_payload = {
        "full_name": "Test User",
        "username": username,
        "email": email,
        "password": password,
        "phone_number": None,
        "location": None,
    }

    r = client.post("/auth/signup", json=signup_payload)
    print("signup status", r.status_code, r.text)
    if r.status_code != 201:
        return 1

    login_payload = {"identifier": email, "password": password}
    r = client.post("/auth/login", json=login_payload)
    print("login status", r.status_code, r.text)
    if r.status_code != 200:
        return 2

    token = r.json().get("token", {}).get("access_token")
    print("token present", bool(token))
    return 0


if __name__ == "__main__":
    raise SystemExit(run_test())
