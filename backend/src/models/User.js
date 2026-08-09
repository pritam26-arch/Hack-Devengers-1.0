const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    resetOtp: { type: String, default: null } // Naya field OTP save karne ke liye
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);