'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  group: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'slug is required'],
    trim: true,
    index: true,
    unique: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Group', schema);