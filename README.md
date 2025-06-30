# Healix

**Healix** is a next-generation telemedicine and digital health platform designed to connect patients and doctors seamlessly. It provides secure video consultations, real-time chat, appointment scheduling, health record management, and innovative VR and AR therapy experiences—all in one place.

---

## Live Demo

[Healix](https://healix-med.vercel.app/)


## Features

- **Secure Authentication** (JWT, Firebase)
- **Patient & Doctor Dashboards**
- **Appointment Scheduling & Calendar Integration**
- **Real-time Chat & Video Calls**
- **Electronic Health Records (EHR)**
- **Prescription Management**
- **Emergency Contact System**
- **VR Therapy Module**
- **Responsive UI (Mobile & Desktop)**
- **Accessibility & Internationalization Ready**

---


## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, A-Frame (for VR and AR)
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** Firebase Auth, JWT
- **Cloud:** Cloudinary (media), Google Calendar API
- **Dev Tools:** ESLint, Prettier, VSCode

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Firebase Project](https://firebase.google.com/)
- [Google Cloud Project](https://console.cloud.google.com/) (for Calendar API)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-org/healix.git
   cd healix
   ```

2. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your configuration.

### Running the App

- **Development:**
  ```sh
  npm run dev
  # or
  yarn dev
  ```

- **Production Build:**
  ```sh
  npm run build
  npm run preview
  ```

---

## Project Structure

```
Healix/
├── backend/         # Express API, Models, Middleware
├── frontend/        # React App (this folder)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── public/
│   └── README.md
├── README.md        # Project root readme
└── ...
```

---

## Usage

- **Patients:** Register, complete your profile, book appointments, chat with doctors, access your health records, and try VR therapy.
- **Doctors:** Register, verify credentials, manage appointments, consult with patients, and update medical records.

---

*Empowering healthcare, one click at a time.*

Built by Team SOS
