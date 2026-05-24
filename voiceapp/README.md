# 🏥 MediCare AI — Voice Appointment Booking System
### Powered by **Bland.ai** (FREE) + React + Node.js + MongoDB

---

Deploy: https://anilmedicalappointment.vercel.app

Backend Check: https://anilmedicalappointment.onrender.com/health

---

## 🆓 Bland.ai Setup (Free - No Credit Card!)

### Step 1: Create Free Account
1. Go to → **https://app.bland.ai**
2. Click **Sign Up** (free account)
3. Verify your email

### Step 2: Get API Key
1. Login → go to **Settings** → **API Keys**
2. Click **Create New Key**
3. Copy the key

### Step 3: Add to .env
```
BLAND_API_KEY=your_key_here
```

That's it! No phone number needed. Bland.ai uses their own numbers. ✅

---

## 🗂 Project Structure

```
voiceapp/
├── client/                  # React.js Frontend
│   └── src/
│       ├── components/
│       │   ├── Calls/
│       │   │   ├── ActiveCallBanner.jsx
│       │   │   └── InitiateCallModal.jsx   ← NEW
│       │   ├── Appointments/
│       │   │   └── AppointmentTable.jsx
│       │   └── Dashboard/
│       │       ├── Sidebar.jsx
│       │       └── StatCard.jsx
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── DashboardLayout.jsx
│       │   ├── OverviewPage.jsx
│       │   ├── AppointmentsPage.jsx
│       │   ├── LiveCallsPage.jsx           ← UPDATED
│       │   ├── RecordingsPage.jsx
│       │   └── SettingsPage.jsx
│       ├── services/
│       │   ├── api.js                      ← UPDATED
│       │   └── socket.js
│       └── hooks/
│           └── useAuth.jsx
└── server/                  # Node.js Backend
    ├── controllers/
    │   ├── blandController.js              ← NEW
    │   ├── callController.js
    │   ├── appointmentController.js
    │   ├── authController.js
    │   └── recordingController.js
    ├── models/
    │   ├── Appointment.js
    │   ├── CallLog.js
    │   └── Admin.js
    ├── routes/
    │   ├── calls.js                        ← UPDATED
    │   ├── appointments.js
    │   ├── recordings.js
    │   └── auth.js
    ├── services/
    │   ├── blandService.js                 ← NEW
    │   ├── twilioService.js
    │   └── aiService.js
    ├── socket/
    │   └── socketManager.js
    ├── middleware/
    │   └── auth.js
    └── server.js
```

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure environment

**server/.env**
```env
PORT=5000
NODE_ENV=development
SERVER_URL=http://localhost:5000

MONGODB_URI=mongodb://localhost:27017/medicare

JWT_SECRET=any_random_secret_123

# Bland.ai FREE API key
BLAND_API_KEY=your_bland_api_key_here

# Doctor's phone (for call transfer)
DOCTOR_PHONE_NUMBER=+91xxxxxxxxxx

CLIENT_URL=http://localhost:5173
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Create admin account
```bash
# Start server first, then run:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr. Admin","email":"admin@medicare.com","password":"password123","role":"admin"}'
```

### 4. Start both servers
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Open: **http://localhost:5173**
Login: **admin@medicare.com** / **password123**

---

## 📞 How Voice Calls Work

```
Doctor clicks "Start AI Call" on dashboard
        ↓
Enters patient phone number (+91...)
        ↓
Bland.ai calls the patient (free!)
        ↓
AI asks: Name → Symptoms → Appointment Time
        ↓
Webhook fires → appointment saved to MongoDB
        ↓
Dashboard updates in real-time via Socket.io
```

---

## 🌐 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | ❌ | Create admin |
| POST | /api/auth/login | ❌ | Login |
| POST | /api/calls/initiate | ✅ | Start Bland.ai call |
| POST | /api/calls/bland-webhook | ❌ | Bland.ai webhook |
| GET  | /api/calls/status/:id | ✅ | Call status |
| GET  | /api/calls/transcript/:id | ✅ | Call transcript |
| GET  | /api/calls/list | ✅ | All calls |
| GET  | /api/appointments | ✅ | List appointments |
| GET  | /api/appointments/stats | ✅ | Dashboard stats |
| PATCH | /api/appointments/:id | ✅ | Update status |
| GET  | /api/recordings | ✅ | Recordings list |

---

## ☁️ Deployment

### Backend → Render (Free)
1. Push `server/` to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Build: `npm install` | Start: `node server.js`
5. Add all env variables
6. Deploy → copy URL

### Frontend → Vercel (Free)
1. Push `client/` to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Framework: **Vite**
4. Add env vars:
   - `VITE_API_URL=https://your-render-url.onrender.com/api`
   - `VITE_SOCKET_URL=https://your-render-url.onrender.com`
5. Deploy

### After Deployment: Set Bland.ai Webhook
In your Bland.ai dashboard:
- Webhook URL: `https://your-render-url.onrender.com/api/calls/bland-webhook`

---

## 🔑 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Voice AI | **Bland.ai (FREE)** |
| Realtime | Socket.io |
| Auth | JWT + bcryptjs |
| Deployment | Vercel + Render |

---

## 📝 License
MIT
# Author 
**Anil Kumar**

