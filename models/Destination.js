'use strict';

const mongoose = require('mongoose');

const AttractionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lat:  { type: Number, required: true },
  lng:  { type: Number, required: true },
}, { _id: false });

const DestinationSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  tagline:     { type: String, required: true, trim: true },
  tag:         { type: String, required: true, trim: true },
  category:    {
    type: String,
    required: true,
    enum: ['Beach', 'Desert', 'Heritage', 'Hill Station', 'Spiritual', 'Adventure'],
  },
  rating:      { type: Number, required: true, min: 0, max: 5 },
  image:       { type: String, required: true },
  description: { type: String, required: true, trim: true },
  bestTimeToVisit: { type: String, required: true, trim: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  attractions:       { type: [AttractionSchema], default: [] },
  nearbyRestaurants: { type: [String], default: [] },
  nearbyHotels:      { type: [String], default: [] },
  nearbyHostels:     { type: [String], default: [] },
  funActivities:     { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Destination', DestinationSchema);
