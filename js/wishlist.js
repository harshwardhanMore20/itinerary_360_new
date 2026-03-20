/**
 * wishlist.js — Shared wishlist utilities
 * Handles adding/removing destinations, places, and activities
 * Uses localStorage for persistence across pages
 */

const Wishlist = (() => {

    const KEYS = {
        destinations: 'i360_wishlist_destinations',
        activities:   'i360_wishlist_activities',
    };

    // ── Helpers ──────────────────────────────────────────────
    function load(key) {
        try { return JSON.parse(localStorage.getItem(key)) || []; }
        catch { return []; }
    }

    function save(key, arr) {
        localStorage.setItem(key, JSON.stringify(arr));
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    }

    // ── Destinations ─────────────────────────────────────────
    function getDestinations()   { return load(KEYS.destinations); }

    function addDestination(item) {
        const list = getDestinations();
        if (!list.find(d => d.id === item.id)) {
            list.push({ ...item, addedAt: Date.now() });
            save(KEYS.destinations, list);
        }
    }

    function removeDestination(id) {
        const list = getDestinations().filter(d => d.id !== id);
        save(KEYS.destinations, list);
    }

    function toggleDestination(item) {
        if (hasDestination(item.id)) {
            removeDestination(item.id);
            return false;
        } else {
            addDestination(item);
            return true;
        }
    }

    function hasDestination(id) {
        return getDestinations().some(d => d.id === id);
    }

    // ── Activities / Places ──────────────────────────────────
    function getActivities()   { return load(KEYS.activities); }

    function addActivity(item) {
        const list = getActivities();
        if (!list.find(a => a.id === item.id)) {
            list.push({ ...item, addedAt: Date.now() });
            save(KEYS.activities, list);
        }
    }

    function removeActivity(id) {
        const list = getActivities().filter(a => a.id !== id);
        save(KEYS.activities, list);
    }

    function toggleActivity(item) {
        if (hasActivity(item.id)) {
            removeActivity(item.id);
            return false;
        } else {
            addActivity(item);
            return true;
        }
    }

    function hasActivity(id) {
        return getActivities().some(a => a.id === id);
    }

    function clearAll() {
        save(KEYS.destinations, []);
        save(KEYS.activities, []);
    }

    // ── Toast notifications ──────────────────────────────────
    let toastTimer = null;

    function showToast(msg, type = 'add') {
        let toast = document.getElementById('globalToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'globalToast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.className = `toast toast-${type}`;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ── Button state management ──────────────────────────────
    function syncWishlistButtons() {
        // Destination buttons
        document.querySelectorAll('[data-wishlist-dest-id]').forEach(btn => {
            const id = btn.dataset.wishlistDestId;
            const active = hasDestination(id);
            btn.classList.toggle('wishlisted', active);
            btn.title = active ? 'Remove from Wishlist' : 'Add to Wishlist';
            btn.setAttribute('aria-pressed', active);
        });

        // Activity buttons
        document.querySelectorAll('[data-wishlist-act-id]').forEach(btn => {
            const id = btn.dataset.wishlistActId;
            const active = hasActivity(id);
            btn.classList.toggle('wishlisted', active);
            btn.title = active ? 'Remove from Wishlist' : 'Add to Wishlist';
            btn.setAttribute('aria-pressed', active);
        });
    }

    function initButtons() {
        // Destination toggle
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-wishlist-dest-id]');
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            const id    = btn.dataset.wishlistDestId;
            const name  = btn.dataset.wishlistDestName  || '';
            const sub   = btn.dataset.wishlistDestSub   || '';
            const badge = btn.dataset.wishlistDestBadge || '';
            const href  = btn.dataset.wishlistDestHref  || '#';
            const img   = btn.dataset.wishlistDestImg   || '';
            const tag   = btn.dataset.wishlistDestTag   || '';
            const added = toggleDestination({ id, name, sub, badge, href, img, tag });
            syncWishlistButtons();
            showToast(
                added ? `❤️ "${name}" added to Wishlist` : `💔 "${name}" removed from Wishlist`,
                added ? 'add' : 'remove'
            );
        });

        // Activity toggle
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-wishlist-act-id]');
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            const id       = btn.dataset.wishlistActId;
            const name     = btn.dataset.wishlistActName     || '';
            const icon     = btn.dataset.wishlistActIcon     || '📌';
            const location = btn.dataset.wishlistActLocation || '';
            const desc     = btn.dataset.wishlistActDesc     || '';
            const added = toggleActivity({ id, name, icon, location, desc });
            syncWishlistButtons();
            showToast(
                added ? `❤️ "${name}" added to Wishlist` : `💔 "${name}" removed from Wishlist`,
                added ? 'add' : 'remove'
            );
        });

        syncWishlistButtons();
    }

    // Listen for wishlist changes from other scripts
    window.addEventListener('wishlistUpdated', syncWishlistButtons);

    return {
        getDestinations,
        addDestination,
        removeDestination,
        toggleDestination,
        hasDestination,
        getActivities,
        addActivity,
        removeActivity,
        toggleActivity,
        hasActivity,
        clearAll,
        showToast,
        syncWishlistButtons,
        initButtons,
    };
})();

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Wishlist.initButtons);
} else {
    Wishlist.initButtons();
}
