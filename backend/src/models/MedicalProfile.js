const mongoose = require('mongoose');

const medicalProfileSchema = new mongoose.Schema(
  {
    userEmail: { type: String, default: 'anonymous@lifetag.com' }, // Default value set to prevent validation error
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    allergies: { type: [String], default: [] },
    medicalConditions: { type: [String], default: [] },
    currentMedications: { type: String, default: '', trim: true },
    emergencyContacts: [
      {
        name: { type: String, required: true },
        relation: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicalProfile', medicalProfileSchema);