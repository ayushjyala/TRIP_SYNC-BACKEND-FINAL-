'use strict';

/**
 * seed.js — Populates MongoDB with Trip Sync destination data.
 * Run: npm run seed
 * Or:  MONGODB_URI="..." node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');
const destinations = require('./data/destinations.json');
async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅  Connected to MongoDB');

        await Destination.deleteMany({});
        console.log('🗑   Cleared existing destinations');

        const inserted = await Destination.insertMany(destinations);
        console.log(`✅  Seeded ${inserted.length} destinations`);
    } catch (err) {
        console.error('❌  Seed error:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌  Disconnected from MongoDB');
    }
}

seed();