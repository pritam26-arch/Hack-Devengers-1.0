require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const twilio = require('twilio'); // Twilio integration for SMS

// Updated paths to look inside the 'src' folder
const connectDB = require('./src/config/db');
const MedicalProfile = require('./src/models/MedicalProfile');
const AlertLog = require('./src/models/AlertLog');
const User = require('./src/models/User'); 

const app = express();
connectDB(); // Connect to MongoDB

app.use(cors());
app.use(express.json());

// ==========================================
// EMAIL & SMS CONFIGURATION
// ==========================================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

// Twilio Client Setup (Safe check if keys are provided)
const hasTwilioKeys = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER;
const twilioClient = hasTwilioKeys ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : null;

// ==========================================
// API ROUTES
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

// 3. GET: Fetch Medical Profile by User Email
app.get('/api/profiles/user/:email', async (req, res) => {
  try {
    const profile = await MedicalProfile.findOne({ userEmail: req.params.email });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found for this user' });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching profile by email:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// NEW: GET Medical Profile by ID (For Public QR Scan /sos/:id)
app.get('/api/profiles/id/:id', async (req, res) => {
  try {
    const profile = await MedicalProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Medical profile not found.' });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching profile by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 4. ALERT: Trigger Emergency Email & SMS with Location (With Rate Limiting)
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

    // STEP B: Fetch the user's emergency contacts
    const profile = await MedicalProfile.findById(profileId);
    if (!profile || !profile.emergencyContacts || profile.emergencyContacts.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile or contacts not found' });
    }

    // STEP C: Construct Location Links & Text
    let locationHtml = "Location access was denied by the scanner.";
    let locationText = "Location: Unavailable";

    if (latitude && longitude) {
      const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      locationHtml = `<a href="${mapsLink}" style="color: #2563eb; font-weight: bold;">Click to View on Google Maps</a>`;
      locationText = `Location: ${mapsLink}`;
    }

    // STEP D: Send Email to ALL Emergency Contacts
    const mailPromises = profile.emergencyContacts.map(contact => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contact.email, 
        subject: `🚨 EMERGENCY ALERT: ${profile.fullName}'s LifeTag was scanned!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #e11d48; border-radius: 10px;">
            <h2 style="color: #e11d48;">🚨 Emergency Alert!</h2>
            <p><strong>${profile.fullName}</strong> has triggered an SOS alert.</p>
            <p><strong>Blood Group:</strong> ${profile.bloodGroup}</p>
            <p><strong>Live Location:</strong> ${locationHtml}</p>
            <hr/>
            <p style="color: #475569; font-size: 12px;">This is an automated alert from LifeTag. Please reach out to them immediately.</p>
          </div>
        `
      };
      
      return transporter.sendMail(mailOptions).catch(err => {
        console.error(`Failed to send email to ${contact.email}:`, err);
      });
    });

    // STEP E: Send SMS via Twilio to Emergency Contacts (if configured)
    let smsPromises = [];
    if (hasTwilioKeys && twilioClient) {
      smsPromises = profile.emergencyContacts.map(contact => {
        return twilioClient.messages.create({
          body: `🚨 LifeTag SOS: ${profile.fullName} has triggered an emergency alert! Blood Group: ${profile.bloodGroup}. ${locationText}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: contact.phone
        }).catch(err => {
          console.error(`Failed to send SMS to ${contact.phone}:`, err);
        });
      });
    }

    await Promise.all([...mailPromises, ...smsPromises]);

    // STEP F: Log this scan in the database so the cooldown starts
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

// 5. POST: Signup API
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists!' });
    }

    const newUser = new User({ fullName, email, phone, password });
    await newUser.save();

    res.status(201).json({ success: true, data: { fullName: newUser.fullName, email: newUser.email } });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
});

// 6. POST: Login API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    res.status(200).json({ success: true, data: { fullName: user.fullName, email: user.email } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// ==========================================
// MANAGE CONTACTS & SECURITY ROUTES
// ==========================================

app.put('/api/profiles/:id/contacts', async (req, res) => {
  try {
    const profile = await MedicalProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.emergencyContacts.push(req.body);
    await profile.save();
    
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ success: false, message: 'Failed to add contact' });
  }
});

app.delete('/api/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    await User.findOneAndDelete({ email });
    await MedicalProfile.findOneAndDelete({ userEmail: email });
    
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
});

// ==========================================
// EDIT PROFILE & CHANGE PASSWORD
// ==========================================

app.put('/api/profiles/:id', async (req, res) => {
  try {
    const updatedProfile = await MedicalProfile.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } 
    );
    if (!updatedProfile) return res.status(404).json({ success: false, message: 'Profile not found' });
    
    res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

app.put('/api/users/password', async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    
    const user = await User.findOne({ email, password: oldPassword });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

// ==========================================
// FORGOT PASSWORD & OTP ROUTES
// =name=========================================

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'LifeTag - Password Reset OTP 🔐',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #e11d48; border-radius: 10px;">
          <h2 style="color: #e11d48;">Password Reset Request</h2>
          <p>Hello ${user.fullName},</p>
          <p>Your One-Time Password (OTP) to reset your LifeTag account password is:</p>
          <h1 style="color: #0f172a; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for a short time. If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'OTP sent successfully to your email.' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, resetOtp: otp });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid OTP or Email.' });
    }

    user.password = newPassword;
    user.resetOtp = null; 
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful! You can now login.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});