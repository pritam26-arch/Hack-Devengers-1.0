# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# ⚡ LifeTag Frontend Client

The high-performance, responsive client-side user interface for **LifeTag**, built with React, Vite, Tailwind CSS, and Lucide React icons.

---

## 🛠️ Tech Stack
* **Framework:** React.js with Vite bundler
* **Styling & UI:** Tailwind CSS, Lucide React icons[cite: 4, 5, 6, 7, 8]
* **Routing:** React Router DOM[cite: 3]
* **QR Code Rendering:** qrcode.react[cite: 5]
* **HTTP Communication:** Axios[cite: 4, 5]

---

## 📂 Component Architecture & Features
* **Public SOS & Emergency View (`App.jsx`):** Features public QR scan routing, live GPS location tracking, emergency services direct dialing, and Web Speech API hands-free voice triggers[cite: 3].
* **Multi-Step Profile Wizard (`CreateProfile.jsx`):** A sleek step-by-step form capturing personal details, blood groups, severe allergies, medical conditions, and emergency contacts[cite: 4].
* **User Control Dashboard (`Dashboard.jsx`):** Tabbed management hub providing overview analytics, QR code rendering, emergency contact lists, live location sharing controls, and security vault settings[cite: 5].
* **Landing Page (`LandingPage.jsx`):** Modern SaaS hero section, interactive workflow guide, core capability cards, and responsive emergency CTA banners[cite: 6].
* **Navigation Bar (`Navbar.jsx`):** Sticky glassmorphism header featuring dynamic user session tracking and event-driven state synchronization[cite: 8].
* **Footer Component (`Footer.jsx`):** Professional footer layout equipped with quick links, support resources, and newsletter subscription input[cite: 7].

---

## 🚀 Getting Started & Local Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend

```

2. Install dependencies:
```bash
npm install react-router-dom axios qrcode.react lucide-react

```


3. Run the development server:
```bash
npm run dev

```


4. Open your browser and view the app at `http://localhost:5173`.

```

```