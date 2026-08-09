
# 🚀 LifeTag Backend API

The robust and secure server-side engine powering **LifeTag**, built with Node.js, Express, and MongoDB[cite: 1, 2]. It handles user authentication, encrypted medical profile vaults, real-time geolocation alerts, and multi-channel emergency broadcasting (Email & SMS)[cite: 1, 2].

---

## 🛠️ Tech Stack & Dependencies
* **Runtime:** Node.js[cite: 1, 2]
* **Framework:** Express.js[cite: 1, 2]
* **Database ODM:** Mongoose (MongoDB)[cite: 1, 2]
* **Email Dispatcher:** Nodemailer (Gmail SMTP & App Passwords)[cite: 1, 2]
* **SMS Messaging:** Twilio Programmable Messaging API[cite: 2]
* **Security & Utility:** CORS, dotenv[cite: 1, 2]

---

## 📂 Project Architecture & Schema Models

```

backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB database connection configuration
│   └── models/
│       ├── User.js            # User authentication, password, and OTP schema
│       ├── MedicalProfile.js  # Patient vitals, blood group, allergies, and emergency contacts schema
│       └── AlertLog.js        # Cooldown management and emergency scan audit logs
├── .env                       # Environment variables config
├── server.js                  # Main Express application and API route controllers
└── package.json

```

---

## 🔌 API Endpoints Reference

### 🔐 Authentication & Account Management
* `POST /api/auth/signup` - Register a new user account with credentials[cite: 1, 2].
* `POST /api/auth/login` - Authenticate user login credentials[cite: 1, 2].
* `POST /api/auth/forgot-password` - Generate and email a 6-digit One-Time Password (OTP) for account recovery[cite: 1, 2].
* `POST /api/auth/reset-password` - Verify OTP and update the account password[cite: 1, 2].
* `PUT /api/users/password` - Update account password from security settings[cite: 1, 2].
* `DELETE /api/users/:email` - Permanently remove user account, profile, and associated logs[cite: 1, 2].

### 🩺 Medical Profiles & Contacts
* `POST /api/profiles` - Save a new medical profile and generate a unique ID[cite: 1, 2].
* `GET /api/profiles/user/:email` - Fetch medical profile details by registered email[cite: 1, 2].
* `GET /api/profiles/id/:id` - Fetch medical profile details by unique ID for public QR code scans (`/sos/:id`)[cite: 2].
* `PUT /api/profiles/:id` - Update existing medical profile attributes (blood group, medications)[cite: 1, 2].
* `PUT /api/profiles/:id/contacts` - Add a new emergency contact to the profile's contact array[cite: 1, 2].

### 🚨 Emergency SOS Alerts
* `POST /api/alerts/:id` - Trigger emergency protocol: validates rate-limiting/cooldown, constructs Google Maps coordinates, broadcasts emergency emails via Nodemailer, and dispatches SMS alerts via Twilio[cite: 1, 2].

---

## ⚙️ Installation & Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd backend

```

2. Install dependencies:


```bash
npm install express cors mongoose dotenv nodemailer twilio

```


3. Create a `.env` file in the root of the backend directory with the required environment variables:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

```


4. Start the server:


```bash
node server.js

```



```

```