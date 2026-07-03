'use strict';

const path = require('path');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const https = require('https');
const rateLimit = require('express-rate-limit');

const Destination = require('./models/Destination');
const Checklist = require('./models/Checklist');
const fallbackDestinations = require('./data/destinations.json');

const app = express();
const PORT = process.env.PORT || 3000;
let DB_CONNECTED = false;

/* ──────────────────────────────────────
   MIDDLEWARE
────────────────────────────────────── */
app.use(cors());
app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'public')));

/* ──────────────────────────────────────
   RATE LIMITING
────────────────────────────────────── */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests — please try again after 15 minutes.' }
});
app.use('/api', apiLimiter);

/* ──────────────────────────────────────
   DATABASE
────────────────────────────────────── */
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        DB_CONNECTED = true;
        console.log('✅  MongoDB connected');
    })
    .catch(err => {
        DB_CONNECTED = false;
        console.error('❌  MongoDB connection error:', err.message);
        console.error('Continuing in fallback mode using bundled data. Run `npm run seed` or start MongoDB to enable full functionality.');
    });

/* ──────────────────────────────────────
   HELPER — fetch from Overpass API
────────────────────────────────────── */
function fetchOverpass(lat, lng, radiusMeters = 2000) {
    return new Promise((resolve) => {
        const query = `
[out:json][timeout:10];
(
  node["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
  node["tourism"="hotel"](around:${radiusMeters},${lat},${lng});
  node["tourism"="hostel"](around:${radiusMeters},${lat},${lng});
);
out body;`.trim();

        const encodedQuery = encodeURIComponent(query);
        const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;

        const req = https.get(url, { timeout: 12000 }, (res) => {
            let raw = '';
            res.on('data', chunk => { raw += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(raw);
                    const restaurants = [];
                    const hotels = [];

                    (json.elements || []).forEach(el => {
                        const name = el.tags && (el.tags.name || el.tags['name:en']);
                        if (!name) return;
                        const item = { name, lat: el.lat, lng: el.lon };
                        if (el.tags.amenity === 'restaurant') restaurants.push(item);
                        if (el.tags.tourism === 'hotel' || el.tags.tourism === 'hostel') hotels.push(item);
                    });

                    resolve({ restaurants, hotels });
                } catch (_) {
                    resolve(null);
                }
            });
        });

        req.on('error', () => resolve(null));
        req.on('timeout', () => {
            req.destroy();
            resolve(null);
        });
    });
}

/* ──────────────────────────────────────
   API ROUTES
────────────────────────────────────── */

// ── GET all destinations ──────────────
app.get('/api/destinations', async(req, res, next) => {
    try {
        let destinations;
        if (!DB_CONNECTED) {
            destinations = (fallbackDestinations || []).slice();
        } else {
            destinations = await Destination.find().sort({ name: 1 }).lean();
        }

        // If DB exists but is empty, fall back to bundled data to avoid "No destinations found"
        if (!destinations || destinations.length === 0) {
            destinations = (fallbackDestinations || []).slice();
        }

        // ensure sorted by name for consistent UI
        destinations.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        res.json({ success: true, data: destinations });
    } catch (err) {
        next(err);
    }
});

// ── GET single destination ────────────
app.get('/api/destinations/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        let destination = null;

        if (DB_CONNECTED) {
            try {
                destination = await Destination.findById(id).lean();
            } catch (e) {
                destination = null;
            }
        }

        // If not found in DB (or DB empty), try fallback by slug or name
        if (!destination) {
            const found = (fallbackDestinations || []).find(d => {
                if (!d) return false;
                const slugMatch = d.slug && d.slug.toLowerCase() === id.toLowerCase();
                const nameMatch = d.name && d.name.toLowerCase() === id.toLowerCase();
                return slugMatch || nameMatch;
            });
            if (found) return res.json({ success: true, data: found });
            return res.status(404).json({ success: false, message: 'Destination not found' });
        }

        res.json({ success: true, data: destination });
    } catch (err) {
        next(err);
    }
});

// ── GET nearby places via Overpass ────
app.get('/api/destinations/:id/nearby', async(req, res, next) => {
    try {
        const destination = await Destination.findById(req.params.id).lean();
        if (!destination) {
            return res.status(404).json({ success: false, message: 'Destination not found' });
        }

        const { lat, lng } = destination.coordinates;
        const live = await fetchOverpass(lat, lng, 2000);

        const toObjects = (arr, source) =>
            (arr || []).map(item =>
                typeof item === 'string' ? { name: item, source } : { name: item.name, lat: item.lat, lng: item.lng, source }
            );

        let restaurants = toObjects(destination.nearbyRestaurants, 'static');
        let hotels = toObjects(destination.nearbyHotels, 'static');

        if (live) {
            const existingRestNames = new Set(restaurants.map(r => r.name.toLowerCase()));
            const existingHotelNames = new Set(hotels.map(h => h.name.toLowerCase()));

            live.restaurants.forEach(r => {
                if (!existingRestNames.has(r.name.toLowerCase())) {
                    restaurants.push({ name: r.name, lat: r.lat, lng: r.lng, source: 'live' });
                    existingRestNames.add(r.name.toLowerCase());
                }
            });

            live.hotels.forEach(h => {
                if (!existingHotelNames.has(h.name.toLowerCase())) {
                    hotels.push({ name: h.name, lat: h.lat, lng: h.lng, source: 'live' });
                    existingHotelNames.add(h.name.toLowerCase());
                }
            });
        }

        res.json({
            success: true,
            liveData: !!live,
            data: {
                restaurants: restaurants.slice(0, 12),
                hotels: hotels.slice(0, 12),
                hostels: toObjects(destination.nearbyHostels, 'static')
            }
        });
    } catch (err) {
        next(err);
    }
});

// Live POI endpoint — proxies Overpass for arbitrary coords
app.get('/api/poi', async(req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        const radius = parseInt(req.query.radius, 10) || 2000;
        if (!lat || !lng) return res.status(400).json({ success: false, message: 'Provide lat and lng query parameters.' });

        const live = await fetchOverpass(lat, lng, radius);
        if (!live) return res.status(502).json({ success: false, message: 'Overpass API returned no data.' });

        res.json({ success: true, data: live });
    } catch (err) {
        next(err);
    }
});

// ── GET search ────────────────────────
app.get('/api/search', async(req, res, next) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) {
            const all = await Destination.find().sort({ name: 1 }).lean();
            return res.json({ success: true, data: all });
        }
        const destinations = await Destination.find({
            name: { $regex: q, $options: 'i' }
        }).sort({ name: 1 }).lean();
        res.json({ success: true, data: destinations });
    } catch (err) {
        next(err);
    }
});

/* ──────────────────────────────────────
   CHECKLIST ROUTES
────────────────────────────────────── */

// ── GET global checklist ──────────────
app.get('/api/checklist', async(req, res, next) => {
    try {
        let doc = await Checklist.findById('global');
        if (!doc) {
            doc = await Checklist.create({ _id: 'global', items: [] });
        }
        res.json({ success: true, data: doc.items });
    } catch (err) {
        next(err);
    }
});

// ── PUT global checklist ──────────────
app.put('/api/checklist', async(req, res, next) => {
    try {
        const { items } = req.body;

        // Input validation
        if (items === undefined || items === null) {
            return res.status(400).json({ success: false, message: 'Request body must include an "items" array.' });
        }
        if (!Array.isArray(items)) {
            return res.status(400).json({ success: false, message: '"items" must be an array.' });
        }
        if (items.length > 200) {
            return res.status(400).json({ success: false, message: 'Checklist cannot exceed 200 items.' });
        }

        const sanitised = items.map(({ text, completed }) => ({
            text: String(text || '').slice(0, 80).trim(),
            completed: Boolean(completed)
        })).filter(i => i.text);

        const doc = await Checklist.findByIdAndUpdate(
            'global', { $set: { items: sanitised } }, { new: true, upsert: true, runValidators: true }
        );
        res.json({ success: true, data: doc.items });
    } catch (err) {
        next(err);
    }
});

/* ──────────────────────────────────────
   SPA FALLBACK
────────────────────────────────────── */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ──────────────────────────────────────
   ERROR HANDLING MIDDLEWARE
────────────────────────────────────── */

// 404 handler (for unmatched API routes — SPA fallback handles the rest)
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
    }
    next();
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message).join(', ');
        return res.status(422).json({ success: false, message: `Validation failed: ${messages}` });
    }

    // Mongoose cast error (e.g., bad ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }

    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ?
            'Internal server error.' : err.message
    });
});

/* ──────────────────────────────────────
   START SERVER
────────────────────────────────────── */
app.listen(PORT, () => {
    console.log(`🚀  Trip Sync server running at http://localhost:${PORT}`);
});