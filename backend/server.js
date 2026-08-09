require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

// FIX: Updated paths to look inside the 'src' folder
const connectDB = require('./src/config/db');
const MedicalProfile = require('./src/models/MedicalProfile');
const AlertLog = require('./src/models/AlertLog');

const app = express();
connectDB(); // Connect to MongoDB

app.use(cors());
app.use(express.json());

// ==========================================
// PHASE 3: EMAIL CONFIGURATION (Nodemailer)
// ==========================================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Add this to your .env file
    pass: process.env.EMAIL_PASS  // Add your Gmail App Password to .env
  }
});

// ==========================================
// PHASE 3: API ROUTES
// ==========================================

// 1. Test Route
app.get('/', (req, res) => {
  res.send('LifeTag API is running perfectly on port 8000!');
});

// 2. CREATE: Save Medical Profile & Get Unique ID
app.post('/api/profiles', async (req, res) => {
  try {
    const profile = await MedicalProfile.create(req.body);
    res.status(201).json({ success: true, id: profile._id });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// 3. READ: Fetch Medical Profile for the SOS Screen
app.get('/api/profiles/:id', async (req, res) => {
  try {
    const profile = await MedicalProfile.findById(req.params.id);
    if (!profile || !profile.isActive) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 4. ALERT: Trigger Emergency Email with Location (With Rate Limiting)
app.post('/api/alerts/:id', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const profileId = req.params.id;
    const userIp = req.ip || req.connection.remoteAddress;

    // STEP A: Check if an alert was sent in the last 5 minutes (Spam Protection)
    const recentLog = await AlertLog.findOne({ profileId });
    if (recentLog) {
      return res.status(429).json({ 
        success: false, 
        message: 'Alert already sent recently. Please wait before triggering again.' 
      });
    }

    // STEP B: Fetch the user's emergency contact email
    const profile = await MedicalProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // STEP C: Construct the Google Maps Link
    let locationText = "Location access was denied by the scanner.";
    if (latitude && longitude) {
      locationText = `Live Location: https://maps.google.com/?q=${latitude},${longitude}`;
    }

    // STEP D: Send the Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: profile.emergencyContactEmail,
      subject: `🚨 EMERGENCY ALERT: ${profile.fullName}'s LifeTag was scanned!`,
      text: `Emergency! Someone just scanned ${profile.fullName}'s LifeTag.\n\n${locationText}\n\nPlease check on them immediately.`
    };

    await transporter.sendMail(mailOptions);

    // STEP E: Log this scan in the database so the 5-minute cooldown starts
    await AlertLog.create({
      profileId,
      scannedAtIp: userIp,
      locationProvided: !!(latitude && longitude)
    });

    res.status(200).json({ success: true, message: 'Emergency alert sent successfully!' });

  } catch (error) {
    console.error('Alert Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send alert' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});