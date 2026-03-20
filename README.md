# Itinerary 360 — Project Structure Guide

A travel guide website for Maharashtra, India. Built with HTML, CSS, and vanilla JavaScript.

---

## 📁 Folder Structure

```
itinerary360/
│
├── pages/              ← Main site pages (home, profile, login, about)
│   ├── index.html      ← Homepage: hero, search bar, destination grids
│   ├── profile.html    ← User profile + Wishlist (destinations & activities)
│   ├── login.html      ← Login / authentication page
│   └── about.html      ← About the team and the project
│
├── destinations/       ← Individual destination pages (one per destination)
│   ├── alibaug.html
│   ├── mahabaleshwar.html
│   ├── lonavala.html
│   ├── malvan.html
│   ├── matheran.html
│   ├── dapoli.html
│   ├── ganpatipule.html
│   ├── ratnagiri.html
│   ├── harihareshwar.html
│   ├── malshej-ghat.html
│   ├── rajmachi.html
│   ├── siddhivinayak.html
│   ├── raigad-fort.html      ← Fort pages (new)
│   ├── sinhagad-fort.html    ← Fort pages (new)
│   ├── pratapgad-fort.html   ← Fort pages (new)
│   └── lohagad-fort.html     ← Fort pages (new)
│
├── styles/             ← All CSS stylesheets
│   ├── main.css        ← Shared styles: navbar, footer, cards, destination pages, tokens
│   ├── index.css       ← Home page styles: hero, search bar, featured/all grids
│   ├── profile.css     ← Profile & wishlist page styles
│   └── login.css       ← Login page styles (self-contained, includes fonts)
│
├── js/                 ← All JavaScript files
│   ├── wishlist.js     ← Wishlist engine: add/remove/toggle destinations & activities
│   │                     Uses localStorage for persistence. Fires 'wishlistUpdated' events.
│   ├── navbar.js       ← Shared navbar HTML builder (buildNavbarPages() function)
│   └── destination-builder.js ← Builds destination pages from a data object
│                              (places grid, activities grid, tips, stats, etc.)
│
├── assets/             ← Images (photos of destinations)
│   └── *.jpg / *.png
│
└── components/         ← Shared HTML templates / reference
    └── destination-template.html  ← Blank template for new destination pages
```

---

## 🔑 Key Features

### 1. Wishlist System (`js/wishlist.js`)
- Users can wishlist **destinations** (full destination cards) and **activities/places** (individual items within a destination).
- Data stored in `localStorage` — persists across browser sessions.
- Wishlist visible in `pages/profile.html` under the "Wishlist" tab.
- Remove individual items or clear all.

### 2. Destination Pages (`destinations/*.html`)
- All destination pages use a **data-driven pattern** via `destination-builder.js`.
- To add a new destination: copy `components/destination-template.html`, fill in the data object, and call `buildDestinationPage(data)`.
- Each page includes: stats, places to visit, things to do, detail sections, and tips — all wishlistable.

### 3. Filter & Search (`pages/index.html`)
- Filter by category: All / Beach / Hill Station / Spiritual / **Forts** (now with 4 fort destinations).
- Live text search filters both the Featured and All Destinations grids simultaneously.

### 4. Profile Page (`pages/profile.html`)
- **Account tab**: Edit username, email. Profile data saved to localStorage.
- **Wishlist tab**: Two sub-tabs:
  - 🗺 Destinations: Full destination cards (image, name, badge, Explore link, remove button)
  - 🎯 Activities & Places: Individual items with icon, description, location tag

---

## 🚀 How to Add a New Destination

1. Copy `components/destination-template.html` to `destinations/new-place.html`
2. Fill in the data object at the bottom of the file:
   ```js
   buildDestinationPage({
     id:        'unique-id',
     name:      'Place Name',
     sub:       'Region',
     badge:     'Badge Text',
     tag:       'beach|hill|fort|spiritual',
     href:      'new-place.html',
     img:       '../assets/new-place.jpg',
     title:     'Full Page Title',
     subtitle:  'Short description',
     tags:      ['🏖 Tag1', '...'],
     stats:     [{ label: '...', value: '...' }],
     places:    [{ name: '...', icon: '...', desc: '...' }],
     activities:[{ icon: '...', name: '...', desc: '...' }],
     sections:  [{ icon: '...', title: '...', items: [...] }],
     tips:      [{ icon: '...', title: '...', content: [...] }],
   });
   ```
3. Add the destination to the `destinations` array in `pages/index.html`
4. Add a link in the navbar dropdown in `js/navbar.js`

---

## 🎨 Design System

Colors (CSS variables in `styles/main.css`):
- `--cream`: Background (`#faf6f0`)
- `--ink`: Dark text (`#1a1108`)
- `--amber`: Brand accent (`#d4841a`)
- `--muted`: Secondary text (`#7c6e5e`)
- `--border`: Card borders (`#ede5d8`)

Fonts:
- **Display**: Cormorant Garamond (headings, card titles, logo)
- **Body**: Outfit (all other text)

---

*Built with ♥ at PVPIT Sangli, Maharashtra — 2025*
