/**
 * darkmode.js — Dark mode toggle
 * - Reads saved preference from localStorage on every page load
 * - Toggles `body.dark` class when the button is clicked
 * - Updates the button icon (🌙 / ☀️)
 * - Works on all pages automatically
 */

(function () {

    // ── Apply saved preference immediately (before page renders) ──
    const saved = localStorage.getItem('i360_darkmode');
    if (saved === 'dark') {
        document.body.classList.add('dark');
    }

    // ── Run after DOM is ready ────────────────────────────────────
    function init() {
        const btn = document.getElementById('darkToggleBtn');
        if (!btn) return;

        // Set correct icon based on current state
        updateIcon(btn);

        btn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark');
            localStorage.setItem('i360_darkmode', isDark ? 'dark' : 'light');
            updateIcon(btn);
        });
    }

    function updateIcon(btn) {
        const isDark = document.body.classList.contains('dark');
        btn.textContent = isDark ? '☀️' : '🌙';
        btn.title       = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }

    // Init after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
