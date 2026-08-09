const mongoose = require('mongoose');

/**
 * Schema for logging QR scans and preventing email spam (Rate Limiting).
 * Uses a TTL (Time-To-Live) index to automatically delete records after 5 minutes.
 */
const alertLogSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalProfile',
    required: true
  },
  scannedAtIp: {
    type: String,
    required: true // Used to track who is scanning to prevent abuse
  },
  locationProvided: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // TTL Index: This document will automatically self-destruct after 300 seconds (5 mins)
    expires: 300 
  }
});

module.exports = mongoose.model('AlertLog', alertLogSchema);