/* ═══════════════════════════════════════════
   TRIP SYNC — script.js (Full-Stack Edition)
   ═══════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────
   AOS INIT
────────────────────────────────────── */
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60
});

/* ──────────────────────────────────────
   CUSTOM CURSOR
────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursorGlow');
  if (!cursor || window.matchMedia('(hover: none)').matches) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .dest-card, .filter-tag').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
  });
})();

/* ──────────────────────────────────────
   NAVBAR: SCROLL + ACTIVE LINK
────────────────────────────────────── */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  const links      = navLinks.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });

  const sections = ['hero', 'destinations', 'plan', 'about', 'contact'];
  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    let active = 'hero';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) active = id;
    });
    links.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === active);
    });
  }
  updateActiveLink();
})();

/* ──────────────────────────────────────
   MOUSE TRAIL GLOW
────────────────────────────────────── */
(function initMouseTrail() {
  const canvas = document.getElementById('mouseTrailCanvas');
  if (!canvas || window.matchMedia('(hover: none)').matches) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const trail = [];
  const MAX   = 28;
  let   mx = -999, my = -999;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    trail.push({ x: mx, y: my, r: 22, alpha: 0.55 });
    if (trail.length > MAX) trail.shift();
  }, { passive: true });

  // Gradient overlay shifts with cursor
  let gradX = 0.5, gradY = 0.5;
  window.addEventListener('mousemove', e => {
    gradX = e.clientX / window.innerWidth;
    gradY = e.clientY / window.innerHeight;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle colour-shifting gradient overlay
    const grd = ctx.createRadialGradient(
      gradX * canvas.width, gradY * canvas.height, 0,
      gradX * canvas.width, gradY * canvas.height, 400
    );
    grd.addColorStop(0, `rgba(0,240,255,0.045)`);
    grd.addColorStop(0.5, `rgba(155,93,229,0.03)`);
    grd.addColorStop(1, `rgba(0,0,0,0)`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Trail particles
    trail.forEach((p, i) => {
      p.alpha -= 0.018;
      p.r     += 0.5;
      if (p.alpha <= 0) return;
      const ratio = i / MAX;
      const r = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      const hue = 180 + ratio * 100; // cyan → violet
      r.addColorStop(0, `hsla(${hue},100%,70%,${p.alpha})`);
      r.addColorStop(1, `hsla(${hue},100%,70%,0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = r;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ──────────────────────────────────────
   BACK TO TOP BUTTON
────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ──────────────────────────────────────
   NEON TOAST UTILITY
────────────────────────────────────── */
let _toastTimer = null;
function showToast(msg = 'Saved', type = 'success') {
  const toast = document.getElementById('neonToast');
  const msgEl = document.getElementById('neonToastMsg');
  if (!toast) return;
  msgEl.textContent = msg;
  toast.className   = 'neon-toast show ' + type;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}


(function initThreeHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x050810, 1);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 80);

  /* ── Lights ── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));

  const lights = [
    { color: 0x00f0ff, intensity: 3,   pos: [40, 40, 40] },
    { color: 0x9b5de5, intensity: 3,   pos: [-40, 20, 30] },
    { color: 0xf5c518, intensity: 1.5, pos: [0, -40, 20] },
    { color: 0x00f0ff, intensity: 2,   pos: [-60, -20, 60] },
    { color: 0xff6e6e, intensity: 1.2, pos: [60, -30, 10] },
  ];
  const pointLights = lights.map(({ color, intensity, pos }) => {
    const light = new THREE.PointLight(color, intensity, 200);
    light.position.set(...pos);
    scene.add(light);
    return light;
  });

  /* ── 3D Floating Shapes ── */
  const geometries = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.DodecahedronGeometry(1, 0),
  ];
  const shapeMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.55 }),
    new THREE.MeshStandardMaterial({ color: 0x9b5de5, wireframe: true, transparent: true, opacity: 0.45 }),
    new THREE.MeshStandardMaterial({ color: 0xf5c518, wireframe: true, transparent: true, opacity: 0.35 }),
    new THREE.MeshStandardMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.08, metalness: 0.8, roughness: 0.1 }),
  ];

  // Reduce particle count on low-end devices (concurrency hint or small memory)
  const isLowEnd = navigator.hardwareConcurrency <= 4 || (navigator.deviceMemory && navigator.deviceMemory <= 4);
  const SHAPE_COUNT = isLowEnd ? 80 : 200;

  const shapes = [];
  for (let i = 0; i < SHAPE_COUNT; i++) {
    const geo   = geometries[Math.floor(Math.random() * geometries.length)];
    const mat   = shapeMaterials[Math.floor(Math.random() * shapeMaterials.length)];
    const mesh  = new THREE.Mesh(geo, mat);
    const scale = 0.4 + Math.random() * 2.5;
    mesh.scale.setScalar(scale);
    mesh.position.set(
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 120,
      (Math.random() - 0.5) * 100
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.userData = {
      rotSpeed:    new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008
      ),
      floatOffset: Math.random() * Math.PI * 2,
      floatSpeed:  0.3 + Math.random() * 0.5,
      floatAmp:    1   + Math.random() * 3
    };
    scene.add(mesh);
    shapes.push(mesh);
  }

  /* ── Star Field (3 layers) ── */
  function createStarLayer(count, size, spread, color, opacity) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * spread;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity, sizeAttenuation: true });
    return new THREE.Points(geo, mat);
  }
  const starMult = isLowEnd ? 0.5 : 1;
  scene.add(createStarLayer(Math.floor(2000 * starMult), 0.35, 500, 0x00f0ff, 0.55));
  scene.add(createStarLayer(Math.floor(1500 * starMult), 0.2,  400, 0x9b5de5, 0.35));
  scene.add(createStarLayer(Math.floor(800  * starMult), 0.5,  300, 0xffffff, 0.2));

  /* ── Mouse Parallax / Touch Auto-Animation ── */
  const mouse     = { x: 0, y: 0 };
  const targetCam = { x: 0, y: 0 };
  let isTouchDevice = window.matchMedia('(hover: none)').matches;
  let autoAngle = 0;

  if (!isTouchDevice) {
    window.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    isTouchDevice = window.matchMedia('(hover: none)').matches;
  }, { passive: true });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    shapes.forEach(mesh => {
      const { rotSpeed, floatOffset, floatSpeed, floatAmp } = mesh.userData;
      mesh.rotation.x += rotSpeed.x;
      mesh.rotation.y += rotSpeed.y;
      mesh.rotation.z += rotSpeed.z;
      mesh.position.y += Math.sin(t * floatSpeed + floatOffset) * floatAmp * 0.004;
    });

    pointLights.forEach((light, i) => {
      const angle = t * 0.3 + (i * Math.PI * 2) / pointLights.length;
      light.position.x = Math.cos(angle) * 60;
      light.position.z = Math.sin(angle) * 60;
    });

    if (isTouchDevice) {
      autoAngle  += 0.004;
      targetCam.x = Math.sin(autoAngle) * 6;
      targetCam.y = Math.cos(autoAngle * 0.7) * 3;
    } else {
      targetCam.x += (mouse.x * 10 - targetCam.x) * 0.04;
      targetCam.y += (-mouse.y * 6  - targetCam.y) * 0.04;
    }
    camera.position.x = targetCam.x;
    camera.position.y = targetCam.y;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
})();

/* ══════════════════════════════════════════════════════════════
   DESTINATIONS — fetched from /api/destinations, then rendered
   client-side filtering for search & category tags.
══════════════════════════════════════════════════════════════ */
const cardsGrid   = document.getElementById('cardsGrid');
const noResults   = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');

let destinations   = [];   // populated after fetch
let activeCategory = 'all';
let searchQuery    = '';

/* ── Highlight matching text ── */
function highlight(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="search-highlight">$1</mark>');
}

/* ── Render cards ── */
function renderCards() {
  const query    = searchQuery.toLowerCase().trim();
  const filtered = destinations.filter(d => {
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    if (!query) return matchCat;

    const searchable = [
      d.name,
      d.tagline,
      d.category,
      d.description || '',
      ...(d.funActivities || []),
      ...(d.nearbyRestaurants || []),
      ...(d.nearbyHotels || []),
      ...(d.nearbyHostels || []),
    ].join(' ').toLowerCase();

    return matchCat && searchable.includes(query);
  });

  cardsGrid.innerHTML = '';
  noResults.style.display = filtered.length === 0 ? 'block' : 'none';

  filtered.forEach((dest, i) => {
    const card = document.createElement('div');
    card.className = 'dest-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String(i % 3 * 80));
    card.innerHTML = `
      <div class="card-img">
        <img src="${dest.image}" alt="${dest.name}" loading="lazy" />
        <div class="card-img-overlay"></div>
        <span class="card-cat-badge">${dest.category}</span>
      </div>
      <div class="card-body">
        <div class="card-rating">★ ${dest.rating.toFixed(1)}</div>
        <h3 class="card-name">${highlight(dest.name, searchQuery)}</h3>
        <p class="card-tagline">${highlight(dest.tagline, searchQuery)}</p>
        <div class="card-footer">
          <span class="card-cta">Explore <span>→</span></span>
          <span style="font-size:0.75rem;color:var(--clr-text-muted)">${dest.tag}</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openModal(dest));
    cardsGrid.appendChild(card);
  });

  AOS.refresh();
}

/* ── Loading skeleton (shows while fetching) ── */
function showSkeletons(count = 6) {
  cardsGrid.innerHTML = Array.from({ length: count }).map(() => `
    <div class="dest-card" style="pointer-events:none;animation:pulse 1.4s ease infinite alternate">
      <div class="card-img" style="background:var(--clr-surface-2);height:220px;border-radius:var(--radius) var(--radius) 0 0"></div>
      <div class="card-body">
        <div style="height:12px;width:40%;background:var(--clr-surface-2);border-radius:4px;margin-bottom:10px"></div>
        <div style="height:20px;width:70%;background:var(--clr-surface-2);border-radius:4px;margin-bottom:8px"></div>
        <div style="height:14px;width:55%;background:var(--clr-surface-2);border-radius:4px"></div>
      </div>
    </div>
  `).join('');
}

/* ── Fetch destinations from API ── */
async function loadDestinations() {
  showSkeletons(6);
  try {
    const res  = await fetch('/api/destinations');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // Normalize: API stores coordinates as {lat,lng} object; map to flat lat/lng
    // so the rest of the code (openModal, initLeafletMap) works unchanged.
    destinations = json.data.map(d => ({
      ...d,
      lat: d.coordinates?.lat ?? d.lat,
      lng: d.coordinates?.lng ?? d.lng
    }));
    renderCards();
  } catch (err) {
    console.error('Failed to load destinations:', err);
    cardsGrid.innerHTML = `
      <p style="color:var(--clr-neon-violet);grid-column:1/-1;text-align:center;padding:2rem">
        ⚠ Could not load destinations. Make sure the server is running and MongoDB is connected.
      </p>`;
  }
}

/* ── Category filter ── */
document.querySelectorAll('.filter-tag').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
    renderCards();
  });
});

/* ── Search ── */
searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  renderCards();
});

/* ── Boot ── */
loadDestinations();

/* ──────────────────────────────────────
   MODAL + LEAFLET MAP
────────────────────────────────────── */
const backdrop    = document.getElementById('modalBackdrop');
const modalClose  = document.getElementById('modalClose');
const modalLoader = document.getElementById('modalLoader');
let leafletMap    = null;
let nearbyMarkers = [];  // track live nearby markers so we can add/clear them

/* ── Show / hide the full-panel loading spinner ── */
function showModalLoader(show) {
  modalLoader.classList.toggle('visible', show);
}

/* ── Tab switching ── */
document.querySelectorAll('.modal-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.modal-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.modal-tab-panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panelId = 'tab-' + tab.dataset.tab;
    document.getElementById(panelId).classList.add('active');

    // Invalidate Leaflet size when map tab becomes visible
    if (tab.dataset.tab === 'overview' && leafletMap) {
      setTimeout(() => leafletMap.invalidateSize(), 50);
    }
  });
});

/* ── Reset tabs to the first one ── */
function resetTabs() {
  document.querySelectorAll('.modal-tab').forEach((t, i) => {
    t.classList.toggle('active', i === 0);
    t.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
  });
  document.querySelectorAll('.modal-tab-panel').forEach((p, i) => {
    p.classList.toggle('active', i === 0);
  });
}

/* ── Build the Best Time seasonal cards ── */
function buildBestTimeSeasons(destName) {
  // Generic season info per destination category — enrich as needed
  const seasons = [
    { icon: '❄️', label: 'Peak',     labelClass: 'peak',     months: 'Oct – Mar' },
    { icon: '🌤',  label: 'Shoulder', labelClass: 'shoulder', months: 'Apr – May' },
    { icon: '🌧',  label: 'Monsoon',  labelClass: 'monsoon',  months: 'Jun – Sep' },
  ];
  return seasons.map(s => `
    <div class="bts-card">
      <span class="bts-icon">${s.icon}</span>
      <div class="bts-label ${s.labelClass}">${s.label}</div>
      <div class="bts-months">${s.months}</div>
    </div>
  `).join('');
}

/* ── Main openModal: fetch fresh data, then populate ── */
async function openModal(dest) {
  // Open the backdrop immediately (shows loader covering empty panel)
  resetTabs();
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  showModalLoader(true);

  // Seed the hero image early (we already have it from the card object)
  document.getElementById('modalHeroImg').style.backgroundImage = `url('${dest.image}')`;

  let freshDest = dest; // fall back to card data if fetch fails

  try {
    const res = await fetch(`/api/destinations/${dest._id}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        freshDest = {
          ...json.data,
          lat: json.data.coordinates?.lat ?? json.data.lat,
          lng: json.data.coordinates?.lng ?? json.data.lng
        };
      }
    }
  } catch (err) {
    console.warn('Could not fetch fresh destination data; using card data.', err);
  }

  // Populate static modal fields
  populateModalStatic(freshDest);
  showModalLoader(false);

  // Init Leaflet on the overview tab (active by default)
  setTimeout(() => initLeafletMap(freshDest), 200);

  // Kick off the nearby fetch in the background (non-blocking)
  loadNearbyPlaces(freshDest);
}

/* ── Populate all static fields ── */
function populateModalStatic(dest) {
  document.getElementById('modalHeroImg').style.backgroundImage = `url('${dest.image}')`;
  document.getElementById('modalTag').textContent         = dest.category;
  document.getElementById('modalTitle').textContent       = dest.name;
  document.getElementById('modalTagline').textContent     = dest.tagline;
  document.getElementById('modalDescription').textContent = dest.description;
  document.getElementById('modalRating').textContent      = `★ ${dest.rating.toFixed(1)}`;

  // Best Time tab
  document.getElementById('modalBestTime').textContent = dest.bestTimeToVisit;
  document.getElementById('bestTimeSeasons').innerHTML = buildBestTimeSeasons(dest.name);

  // Activities tab
  document.getElementById('modalActivities').innerHTML =
    (dest.funActivities || []).map(a => `<span class="activity-pill">${a}</span>`).join('');
}

/* ── Fetch /api/destinations/:id/nearby and render Nearby tab ── */
async function loadNearbyPlaces(dest) {
  const loader    = document.getElementById('nearbyLoader');
  const grid      = document.getElementById('nearbyGrid');
  const statusEl  = document.getElementById('nearbyStatus');

  loader.classList.remove('hidden');
  grid.style.display = 'none';
  statusEl.innerHTML = '';

  let data = null;
  let isLive = false;

  try {
    const res = await fetch(`/api/destinations/${dest._id}/nearby`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        data   = json.data;
        isLive = json.liveData;
      }
    }
  } catch (err) {
    console.warn('Nearby fetch failed; falling back to static data.', err);
  }

  // Fallback to static data already in dest object
  if (!data) {
    data = {
      restaurants: (dest.nearbyRestaurants || []).map(n => ({ name: n, source: 'static' })),
      hotels:      (dest.nearbyHotels      || []).map(n => ({ name: n, source: 'static' })),
      hostels:     (dest.nearbyHostels     || []).map(n => ({ name: n, source: 'static' })),
    };
    isLive = false;
  }

  // Render the badge
  statusEl.innerHTML = isLive
    ? `<span class="nearby-badge live"><i class="fa fa-wifi"></i> Live data from OpenStreetMap</span>`
    : `<span class="nearby-badge cached"><i class="fa fa-database"></i> Curated data</span>`;

  // Render lists
  setNearbyList('modalRestaurants', data.restaurants, '🍴', 'fa-utensils');
  setNearbyList('modalHotels',      data.hotels,      '🛏', 'fa-bed');
  setNearbyList('modalHostels',     data.hostels,     '🏠', 'fa-house-chimney');

  loader.classList.add('hidden');
  grid.style.display = 'grid';

  // Add live nearby markers to the map (only items with coords)
  addNearbyMapMarkers(data, dest);
}

/* ── Render a nearby list ── */
function setNearbyList(elId, items, emoji, faClass) {
  const el = document.getElementById(elId);
  if (!items || items.length === 0) {
    el.innerHTML = `<li style="color:var(--clr-text-muted);font-size:0.8rem;padding:8px 0">No data available.</li>`;
    return;
  }
  el.innerHTML = items.map(item => {
    const isLive  = item.source === 'live';
    const liveDot = isLive ? '<span class="live-dot" title="Live from OpenStreetMap"></span>' : '';
    return `
      <li>
        <i class="fa ${faClass} place-icon" style="color:var(--clr-neon-gold);font-size:0.7rem;margin-top:3px"></i>
        <span class="place-name">${item.name}${liveDot}</span>
      </li>`;
  }).join('');
}

/* ── Add live nearby markers to the Leaflet map ── */
function addNearbyMapMarkers(data, dest) {
  if (!leafletMap) return;

  // Clear previous nearby markers
  nearbyMarkers.forEach(m => m.remove());
  nearbyMarkers = [];

  const makeIcon = (color, symbol) => L.divIcon({
    className: '',
    html: `<div style="
      width:18px;height:18px;border-radius:50%;
      background:${color};
      border:2px solid #fff;
      box-shadow:0 0 10px ${color},0 0 4px #000;
      display:flex;align-items:center;justify-content:center;
      font-size:9px;
    ">${symbol}</div>`,
    iconSize:    [18, 18],
    iconAnchor:  [9, 9],
    popupAnchor: [0, -12]
  });

  const allNearby = [
    ...(data.restaurants || []).map(r => ({ ...r, type: 'restaurant' })),
    ...(data.hotels      || []).map(h => ({ ...h, type: 'hotel' })),
    ...(data.hostels     || []).map(h => ({ ...h, type: 'hostel' })),
  ].filter(p => p.lat && p.lng); // only items with real coordinates (from Overpass)

  allNearby.forEach(place => {
    let color  = '#f5c518';
    let symbol = '🍴';
    if (place.type === 'hotel')  { color = '#00f0ff'; symbol = '🛏'; }
    if (place.type === 'hostel') { color = '#9b5de5'; symbol = '🏠'; }

    const marker = L.marker([place.lat, place.lng], { icon: makeIcon(color, symbol) })
      .addTo(leafletMap)
      .bindPopup(`<strong>${place.name}</strong><br><span style="font-size:0.75rem;color:#7a8ba0">${place.type}</span>`);

    nearbyMarkers.push(marker);
  });
}

/* ── Init (or re-init) the Leaflet map ── */
function initLeafletMap(dest) {
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }
  nearbyMarkers = [];

  leafletMap = L.map('destinationMap', {
    center:             [dest.lat, dest.lng],
    zoom:               12,
    zoomControl:        true,
    attributionControl: false,
    scrollWheelZoom:    false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(leafletMap);

  const makeIcon = (color) => L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${color};
      border:2px solid #fff;
      box-shadow:0 0 10px ${color},0 0 4px #000;
    "></div>`,
    iconSize:    [14, 14],
    iconAnchor:  [7, 7],
    popupAnchor: [0, -10]
  });

  // City centre marker
  L.marker([dest.lat, dest.lng], { icon: makeIcon('#00f0ff') })
    .addTo(leafletMap)
    .bindPopup(`<strong style="color:#00f0ff">${dest.name}</strong><br>City Center`)
    .openPopup();

  // Attraction markers
  (dest.attractions || []).forEach(attr => {
    L.marker([attr.lat, attr.lng], { icon: makeIcon('#9b5de5') })
      .addTo(leafletMap)
      .bindPopup(`<strong>${attr.name}</strong>`);
  });
}

/* ── Close modal ── */
function closeModal() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
  showModalLoader(false);
}

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ──────────────────────────────────────
   PLAN YOUR TRIP — CHECKLIST (Server API)
────────────────────────────────────── */
(function initChecklist() {
  const list       = document.getElementById('checklistList');
  const input      = document.getElementById('checklistInput');
  const addBtn     = document.getElementById('addChecklistItem');
  const progressEl = document.getElementById('checklistProgress');
  const fillEl     = document.getElementById('checklistFill');
  const clearBtn   = document.getElementById('clearChecklist');
  const loaderOvl  = document.getElementById('checklistLoaderOverlay');

  let items       = [];
  let saveTimeout = null;

  /* ── Helpers ── */
  function showChecklistLoader(on) {
    if (!loaderOvl) return;
    loaderOvl.classList.toggle('visible', on);
  }

  function updateProgress() {
    const done  = items.filter(i => i.completed).length;
    const total = items.length;
    progressEl.textContent = `${done} / ${total} done`;
    fillEl.style.width = total === 0 ? '0%' : `${(done / total) * 100}%`;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function render() {
    list.innerHTML = '';
    items.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'checklist-item' + (item.completed ? ' done' : '');
      li.innerHTML = `
        <div class="checklist-checkbox${item.completed ? ' checked' : ''}" role="checkbox"
             aria-checked="${item.completed}" tabindex="0" data-idx="${idx}"></div>
        <span class="item-text">${escapeHtml(item.text)}</span>
        <button class="item-delete" data-idx="${idx}" aria-label="Delete item">✕</button>
      `;
      list.appendChild(li);
    });
    updateProgress();
  }

  /* ── Server sync with debounce ── */
  async function syncToServer() {
    try {
      const res = await fetch('/api/checklist', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ items })
      });
      if (res.ok) showToast('Saved ✓', 'success');
      else        showToast('Save failed', 'error');
    } catch (_) {
      showToast('Offline — save failed', 'error');
    }
  }

  function scheduleSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(syncToServer, 600);
  }

  /* ── Load from server on boot ── */
  async function loadChecklist() {
    showChecklistLoader(true);
    try {
      const res  = await fetch('/api/checklist');
      const json = await res.json();
      if (json.success) items = json.data;
    } catch (_) {
      // graceful degradation — start empty
    }
    showChecklistLoader(false);
    render();
  }

  /* ── Add item ── */
  function addItem(text) {
    text = text.trim();
    if (!text) return;
    items.push({ text, completed: false });
    render();
    input.value = '';
    scheduleSave();
  }

  addBtn.addEventListener('click',  () => addItem(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') addItem(input.value); });

  document.querySelectorAll('.quick-tag').forEach(btn => {
    btn.addEventListener('click', () => addItem(btn.dataset.task));
  });

  /* ── Toggle / Delete ── */
  list.addEventListener('click', e => {
    const cb  = e.target.closest('.checklist-checkbox');
    const del = e.target.closest('.item-delete');
    if (cb) {
      const idx = parseInt(cb.dataset.idx);
      items[idx].completed = !items[idx].completed;
      render(); scheduleSave();
    }
    if (del) {
      const idx = parseInt(del.dataset.idx);
      items.splice(idx, 1);
      render(); scheduleSave();
    }
  });

  list.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const cb = e.target.closest('.checklist-checkbox');
      if (cb) { cb.click(); e.preventDefault(); }
    }
  });

  clearBtn.addEventListener('click', () => {
    if (items.length === 0) return;
    if (confirm('Clear all checklist items?')) {
      items = [];
      render(); scheduleSave();
    }
  });

  loadChecklist();
})();

/* ──────────────────────────────────────
   CONTACT FORM
────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    if (!name || !email || !message) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      success.style.display = 'flex';
      btn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      setTimeout(() => success.style.display = 'none', 5000);
    }, 1200);
  });
})();

/* ──────────────────────────────────────
   SMOOTH SCROLL
────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
