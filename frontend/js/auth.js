/**
 * auth.js — Itinerary 360 Frontend ↔ FastAPI Backend Integration
 *
 * Drop this file into your js/ folder and include it on any page
 * that needs authentication.
 *
 * Usage:
 *   <script src="../js/auth.js"></script>
 *
 * API reference:
 *   Auth.signup({ username, full_name, email, password, location?, phone_number? }) → Promise<AuthResponse>
 *   Auth.login(identifier, password)                   → Promise<AuthResponse>
 *   Auth.logout()                                      → Promise<void>
 *   Auth.getProfile()                                  → Promise<UserResponse>
 *   Auth.updateProfile(fields)                         → Promise<UserResponse>
 *   Auth.isLoggedIn()                                  → boolean
 *   Auth.getUser()                                     → object | null
 *   Auth.requireAuth(redirectTo?)                      → void (redirects if not logged in)
 */

const Auth = (() => {

    const BASE_URL = 'http://127.0.0.1:8000';  // ← change if deployed
    const TOKEN_KEY   = 'i360_access_token';
    const USER_KEY    = 'i360_user';

    // ── Storage helpers ──────────────────────────────────────────────────────

    function saveSession(token, user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    function clearSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem(USER_KEY));
        } catch {
            return null;
        }
    }

    function isLoggedIn() {
        return !!getToken();
    }

    function requireAuth(redirectTo = '../pages/login.html') {
        if (!isLoggedIn()) {
            window.location.href = redirectTo;
        }
    }

    // ── Fetch wrapper ────────────────────────────────────────────────────────

    async function request(path, options = {}) {
        const token = getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        };

        const response = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            // FastAPI returns { detail: string | array }
            const message = Array.isArray(data.detail)
                ? data.detail.map(e => e.msg).join('; ')
                : (data.detail || `HTTP ${response.status}`);
            throw new Error(message);
        }

        return data;
    }

    // ── Auth API ─────────────────────────────────────────────────────────────

    async function signup({ username, full_name, email, password, location = null, phone_number = null }) {
        const data = await request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username, full_name, email, password, location, phone_number }),
        });
        saveSession(data.token.access_token, data.user);
        return data;
    }

    async function login(identifier, password) {
        const data = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ identifier, password }),
        });
        saveSession(data.token.access_token, data.user);
        return data;
    }

    async function logout() {
        try {
            await request('/auth/logout', { method: 'POST' });
        } finally {
            clearSession();
        }
    }

    // ── Profile API ──────────────────────────────────────────────────────────

    async function getProfile() {
        const data = await request('/profile');
        // Keep localStorage in sync
        localStorage.setItem(USER_KEY, JSON.stringify(data));
        return data;
    }

    async function updateProfile(fields) {
        const data = await request('/profile', {
            method: 'PATCH',
            body: JSON.stringify(fields),
        });
        localStorage.setItem(USER_KEY, JSON.stringify(data));
        return data;
    }

    // ── Navbar helpers ───────────────────────────────────────────────────────

    /**
     * Call this after buildNavbar() or buildNavbarPages() to update the
     * Login button to show the username when logged in.
     */
    function updateNavbarAuthState() {
        const loginBtn = document.querySelector('.login-btn');
        if (!loginBtn) return;

        const loginLink = loginBtn.closest('a');
        const user = getUser();
        if (user) {
            loginBtn.textContent = `👤 ${user.username}`;
            if (loginLink) {
                loginLink.href = 'profile.html';
            }
            loginBtn.onclick = () => window.location.href = 'profile.html';
        }
    }

    return {
        signup,
        login,
        logout,
        getProfile,
        updateProfile,
        isLoggedIn,
        getUser,
        requireAuth,
        updateNavbarAuthState,
    };

})();
