/**
 * navbar.js — Inject shared navbar HTML into all pages
 * Just call buildNavbar('active-page-id') in each page
 * active-page-id: 'home' | 'popular' | 'about' | 'profile'
 */

function buildNavbar(activePage = '') {
    const nav = document.getElementById('mainNavbar');
    if (!nav) return;

    nav.innerHTML = `
        <a href="../pages/index.html" class="logo">Itinerary <em>360</em></a>
        <nav class="nav-links">
            <a href="../pages/index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a>

            <div class="drop-down">
                <span class="dropdown-trigger">Destinations</span>
                <div class="dropdown-content">
                    <span class="dropdown-label">Konkan Coast</span>
                    <a href="../destinations/alibaug.html">Alibaug</a>
                    <a href="../destinations/ganpatipule.html">Ganpatipule</a>
                    <a href="../destinations/malvan.html">Malvan</a>
                    <a href="../destinations/ratnagiri.html">Ratnagiri</a>
                    <a href="../destinations/dapoli.html">Dapoli</a>
                    <a href="../destinations/harihareshwar.html">Harihareshwar</a>
                    <span class="dropdown-label">Western Ghats</span>
                    <a href="../destinations/malshej-ghat.html">Malshej Ghat</a>
                    <a href="../destinations/mahabaleshwar.html">Mahabaleshwar</a>
                    <a href="../destinations/lonavala.html">Lonavala &amp; Khandala</a>
                    <a href="../destinations/matheran.html">Matheran</a>
                    <a href="../destinations/rajmachi.html">Rajmachi</a>
                    <span class="dropdown-label">Forts &amp; Heritage</span>
                    <a href="../destinations/raigad-fort.html">Raigad Fort</a>
                    <a href="../destinations/sinhagad-fort.html">Sinhagad Fort</a>
                    <a href="../destinations/pratapgad-fort.html">Pratapgad Fort</a>
                    <a href="../destinations/lohagad-fort.html">Lohagad Fort</a>
                    <span class="dropdown-label">Spiritual</span>
                    <a href="../destinations/siddhivinayak.html">Siddhivinayak Temple</a>
                </div>
            </div>

            <a href="../pages/index.html#all-destinations" class="${activePage === 'popular' ? 'active' : ''}">Popular</a>
            <a href="../pages/about.html" class="${activePage === 'about' ? 'active' : ''}">About Us</a>
            <a href="../pages/profile.html" class="${activePage === 'profile' ? 'active' : ''}">Profile</a>
        </nav>
        <div style="display:flex;align-items:center;gap:10px;">
            <button class="dark-toggle" id="darkToggleBtn" title="Toggle Dark Mode" aria-label="Toggle Dark Mode">🌙</button>
            <a href="../pages/login.html"><button class="login-btn">Login</button></a>
        </div>
    `;
}

// For pages/ directory (relative paths differ)
function buildNavbarPages(activePage = '') {
    const nav = document.getElementById('mainNavbar');
    if (!nav) return;

    nav.innerHTML = `
        <a href="index.html" class="logo">Itinerary <em>360</em></a>
        <nav class="nav-links">
            <a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a>

            <div class="drop-down">
                <span class="dropdown-trigger">Destinations</span>
                <div class="dropdown-content">
                    <span class="dropdown-label">Konkan Coast</span>
                    <a href="../destinations/alibaug.html">Alibaug</a>
                    <a href="../destinations/ganpatipule.html">Ganpatipule</a>
                    <a href="../destinations/malvan.html">Malvan</a>
                    <a href="../destinations/ratnagiri.html">Ratnagiri</a>
                    <a href="../destinations/dapoli.html">Dapoli</a>
                    <a href="../destinations/harihareshwar.html">Harihareshwar</a>
                    <span class="dropdown-label">Western Ghats</span>
                    <a href="../destinations/malshej-ghat.html">Malshej Ghat</a>
                    <a href="../destinations/mahabaleshwar.html">Mahabaleshwar</a>
                    <a href="../destinations/lonavala.html">Lonavala &amp; Khandala</a>
                    <a href="../destinations/matheran.html">Matheran</a>
                    <a href="../destinations/rajmachi.html">Rajmachi</a>
                    <span class="dropdown-label">Forts &amp; Heritage</span>
                    <a href="../destinations/raigad-fort.html">Raigad Fort</a>
                    <a href="../destinations/sinhagad-fort.html">Sinhagad Fort</a>
                    <a href="../destinations/pratapgad-fort.html">Pratapgad Fort</a>
                    <a href="../destinations/lohagad-fort.html">Lohagad Fort</a>
                    <span class="dropdown-label">Spiritual</span>
                    <a href="../destinations/siddhivinayak.html">Siddhivinayak Temple</a>
                </div>
            </div>

            <a href="index.html#all-destinations" class="${activePage === 'popular' ? 'active' : ''}">Popular</a>
            <a href="about.html" class="${activePage === 'about' ? 'active' : ''}">About Us</a>
            <a href="profile.html" class="${activePage === 'profile' ? 'active' : ''}">Profile</a>
        </nav>
        <div style="display:flex;align-items:center;gap:10px;">
            <button class="dark-toggle" id="darkToggleBtn" title="Toggle Dark Mode" aria-label="Toggle Dark Mode">🌙</button>
            <a href="login.html"><button class="login-btn">Login</button></a>
        </div>
    `;
}
