function setupMobileNav(nav) {
  const menuButton = nav.querySelector(".mobile-nav-toggle");
  const links = nav.querySelector(".nav-links");
  const dropdown = nav.querySelector(".drop-down");
  const dropdownButton = nav.querySelector(".dropdown-trigger");

  if (!menuButton || !links || !dropdown || !dropdownButton) return;

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation",
    );
    menuButton.classList.toggle("is-open", isOpen);
    links.classList.toggle("is-open", isOpen);
  });

  dropdownButton.addEventListener("click", () => {
    if (!window.matchMedia("(max-width: 800px)").matches) return;
    const isOpen = dropdown.classList.toggle("is-open");
    dropdownButton.setAttribute("aria-expanded", String(isOpen));
  });

  links.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.classList.remove("is-open");
    links.classList.remove("is-open");
    dropdown.classList.remove("is-open");
    dropdownButton.setAttribute("aria-expanded", "false");
  });
}

function buildNavbar(activePage = "") {
  const nav = document.getElementById("mainNavbar");
  if (!nav) return;

  nav.innerHTML = `
        <a href="../pages/index.html" class="logo">Itinerary <em>360</em></a>
        <nav class="nav-links">
            <a href="../pages/index.html" class="${activePage === "home" ? "active" : ""}">Home</a>

            <div class="drop-down">
                <button type="button" class="dropdown-trigger" aria-expanded="false">Destinations</button>
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

            <a href="../pages/index.html#all-destinations" class="${activePage === "popular" ? "active" : ""}">Popular</a>
            <a href="../pages/about.html" class="${activePage === "about" ? "active" : ""}">About Us</a>
            <a href="../pages/profile.html" class="${activePage === "profile" ? "active" : ""}">Profile</a>
        </nav>
        <button type="button" class="mobile-nav-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="primaryNavLinks">
            <span></span><span></span><span></span>
        </button>
        <div class="nav-actions">
            <button class="dark-toggle" id="darkToggleBtn" title="Toggle Dark Mode" aria-label="Toggle Dark Mode">🌙</button>
            <a href="../pages/login.html"><button class="login-btn">Login</button></a>
        </div>
    `;
  nav.querySelector(".nav-links").id = "primaryNavLinks";
  setupMobileNav(nav);
}

// For pages/ directory (relative paths differ)
function buildNavbarPages(activePage = "") {
  const nav = document.getElementById("mainNavbar");
  if (!nav) return;

  nav.innerHTML = `
        <a href="index.html" class="logo">Itinerary <em>360</em></a>
        <nav class="nav-links">
            <a href="index.html" class="${activePage === "home" ? "active" : ""}">Home</a>

            <div class="drop-down">
                <button type="button" class="dropdown-trigger" aria-expanded="false">Destinations</button>
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

            <a href="index.html#all-destinations" class="${activePage === "popular" ? "active" : ""}">Popular</a>
            <a href="about.html" class="${activePage === "about" ? "active" : ""}">About Us</a>
            <a href="profile.html" class="${activePage === "profile" ? "active" : ""}">Profile</a>
        </nav>
        <button type="button" class="mobile-nav-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="primaryNavLinks">
            <span></span><span></span><span></span>
        </button>
        <div class="nav-actions">
            <button class="dark-toggle" id="darkToggleBtn" title="Toggle Dark Mode" aria-label="Toggle Dark Mode">🌙</button>
            <a href="login.html"><button class="login-btn">Login</button></a>
        </div>
    `;
  nav.querySelector(".nav-links").id = "primaryNavLinks";
  setupMobileNav(nav);
}
