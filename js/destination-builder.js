/**
 * destination-builder.js
 * Builds destination page content dynamically from a data object.
 * Each destination page calls buildDestinationPage(data) after including this script.
 */

function buildDestinationPage(data) {
    // ── Navbar ────────────────────────────────────────────────
    const nav = document.getElementById('mainNavbar');
    if (nav) {
        nav.innerHTML = `
            <a href="../pages/index.html" class="logo">Itinerary <em>360</em></a>
            <nav class="nav-links">
                <a href="../pages/index.html">Home</a>
                <div class="drop-down">
                    <span class="dropdown-trigger">Destinations</span>
                    <div class="dropdown-content">
                        <span class="dropdown-label">Konkan Coast</span>
                        <a href="alibaug.html">Alibaug</a>
                        <a href="ganpatipule.html">Ganpatipule</a>
                        <a href="malvan.html">Malvan</a>
                        <a href="ratnagiri.html">Ratnagiri</a>
                        <a href="dapoli.html">Dapoli</a>
                        <a href="harihareshwar.html">Harihareshwar</a>
                        <span class="dropdown-label">Western Ghats</span>
                        <a href="malshej-ghat.html">Malshej Ghat</a>
                        <a href="mahabaleshwar.html">Mahabaleshwar</a>
                        <a href="lonavala.html">Lonavala &amp; Khandala</a>
                        <a href="matheran.html">Matheran</a>
                        <a href="rajmachi.html">Rajmachi</a>
                        <span class="dropdown-label">Forts &amp; Heritage</span>
                        <a href="raigad-fort.html">Raigad Fort</a>
                        <a href="sinhagad-fort.html">Sinhagad Fort</a>
                        <a href="pratapgad-fort.html">Pratapgad Fort</a>
                        <a href="lohagad-fort.html">Lohagad Fort</a>
                        <span class="dropdown-label">Spiritual</span>
                        <a href="siddhivinayak.html">Siddhivinayak Temple</a>
                    </div>
                </div>
                <a href="../pages/index.html#all-destinations">Popular</a>
                <a href="../pages/about.html">About Us</a>
                <a href="../pages/profile.html">Profile</a>
            </nav>
            <a href="../pages/login.html"><button class="login-btn">Login</button></a>
        `;
    }

    // ── Wishlist button state ─────────────────────────────────
    const isWishlisted = Wishlist.hasDestination(data.id);

    // ── Stats grid ────────────────────────────────────────────
    const statsHTML = data.stats ? `
        <h2 class="section-heading">Overview</h2>
        <div class="statistics-grid">
            ${data.stats.map(s => `
                <div class="stat-card">
                    <h4>${s.label}</h4>
                    <p>${s.value}</p>
                </div>`).join('')}
        </div>` : '';

    // ── Places grid ───────────────────────────────────────────
    const placesHTML = data.places ? `
        <h2 class="section-heading">Places to Visit</h2>
        <div class="places-grid">
            ${data.places.map(p => {
                const pid = `${data.id}_place_${p.name.replace(/\s+/g,'_').toLowerCase()}`;
                const pWishlisted = Wishlist.hasActivity(pid);
                return `
                <div class="place-card">
                    <img src="${p.img || ''}" alt="${p.name}" class="place-img"
                         onerror="this.style.background='linear-gradient(135deg,#f0e0c0,#d4a96a)'">
                    <div class="place-body">
                        <h4>${p.name}</h4>
                        <p>${p.desc}</p>
                    </div>
                    <button class="place-wishlist-btn ${pWishlisted ? 'wishlisted' : ''}"
                        data-wishlist-act-id="${pid}"
                        data-wishlist-act-name="${p.name}"
                        data-wishlist-act-icon="${p.icon || '📍'}"
                        data-wishlist-act-location="${data.name}"
                        data-wishlist-act-desc="${p.desc}"
                        title="${pWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                        ${pWishlisted ? '❤️' : '🤍'}
                    </button>
                </div>`;
            }).join('')}
        </div>` : '';

    // ── Activities grid ───────────────────────────────────────
    const activitiesHTML = data.activities ? `
        <h2 class="section-heading">Things to Do</h2>
        <div class="activities-grid">
            ${data.activities.map(a => {
                const aid = `${data.id}_act_${a.name.replace(/\s+/g,'_').toLowerCase()}`;
                const aWishlisted = Wishlist.hasActivity(aid);
                return `
                <div class="activity-card">
                    <div class="act-icon">${a.icon}</div>
                    <h4>${a.name}</h4>
                    <p>${a.desc}</p>
                    <button class="act-wishlist-btn ${aWishlisted ? 'wishlisted' : ''}"
                        data-wishlist-act-id="${aid}"
                        data-wishlist-act-name="${a.name}"
                        data-wishlist-act-icon="${a.icon}"
                        data-wishlist-act-location="${data.name}"
                        data-wishlist-act-desc="${a.desc}"
                        title="${aWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                        ${aWishlisted ? '❤️' : '🤍'}
                    </button>
                </div>`;
            }).join('')}
        </div>` : '';

    // ── Detail sections ───────────────────────────────────────
    const detailsHTML = data.sections ? data.sections.map(s => `
        <div class="detail-section">
            <h3><span class="icon">${s.icon}</span> ${s.title}</h3>
            <ul>${s.items.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>`).join('') : '';

    // ── Tips ──────────────────────────────────────────────────
    const tipsHTML = data.tips ? `
        <h2 class="section-heading">Practical Tips</h2>
        <div class="tips-grid">
            ${data.tips.map(t => `
                <div class="tip-card">
                    <h4>${t.icon} ${t.title}</h4>
                    ${Array.isArray(t.content)
                        ? `<ul>${t.content.map(c => `<li>${c}</li>`).join('')}</ul>`
                        : `<p>${t.content}</p>`}
                </div>`).join('')}
        </div>` : '';

    // ── Render into #destMain ─────────────────────────────────
    const main = document.getElementById('destMain');
    if (!main) return;

    main.innerHTML = `
        <div class="header-image-container">
            <img src="${data.img}" alt="${data.name}" class="header-image"
                 onerror="this.style.background='linear-gradient(135deg,#f0e0c0,#c8956a)'">
            <div class="image-overlay">
                <p class="breadcrumb">
                    <a href="../pages/index.html">Home</a> › ${data.name}
                </p>
                <h1>${data.title}</h1>
                <p>${data.subtitle}</p>
                <div class="tags">
                    ${data.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            </div>
        </div>

        <div class="dest-actions">
            <a href="../pages/index.html" class="back-btn">← Back to all destinations</a>
            <button class="dest-wishlist-btn ${isWishlisted ? 'wishlisted' : ''}"
                id="destWishlistBtn"
                data-wishlist-dest-id="${data.id}"
                data-wishlist-dest-name="${data.name}"
                data-wishlist-dest-sub="${data.sub}"
                data-wishlist-dest-badge="${data.badge}"
                data-wishlist-dest-href="${data.href}"
                data-wishlist-dest-img="${data.img}"
                data-wishlist-dest-tag="${data.tag}">
                ${isWishlisted ? '❤️ Saved to Wishlist' : '🤍 Add to Wishlist'}
            </button>
        </div>

        <div class="content-container">
            ${statsHTML}
            ${placesHTML}
            ${activitiesHTML}
            ${detailsHTML}
            ${tipsHTML}
        </div>
    `;

    // ── Update wishlist button text on change ─────────────────
    window.addEventListener('wishlistUpdated', () => {
        const btn = document.getElementById('destWishlistBtn');
        if (!btn) return;
        const active = Wishlist.hasDestination(data.id);
        btn.innerHTML = active ? '❤️ Saved to Wishlist' : '🤍 Add to Wishlist';
        btn.classList.toggle('wishlisted', active);

        // Update act/place buttons emoji
        document.querySelectorAll('[data-wishlist-act-id]').forEach(b => {
            b.innerHTML = Wishlist.hasActivity(b.dataset.wishlistActId) ? '❤️' : '🤍';
        });
    });
}
