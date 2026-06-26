'use strict';

const mongoose = require('mongoose');

const ChecklistItemSchema = new mongoose.Schema({
  text:      { type: String, required: true, trim: true, maxlength: 80 },
  completed: { type: Boolean, default: false }
}, { _id: false });

const ChecklistSchema = new mongoose.Schema({
  _id:   { type: String, default: 'global' },
  items: { type: [ChecklistItemSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Checklist', ChecklistSchema);
