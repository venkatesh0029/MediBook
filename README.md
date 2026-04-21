<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-7.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

<h1 align="center">🏥 MediBook — AI-Powered Smart Healthcare Orchestrator</h1>

<p align="center">
  <strong>An intelligent, full-stack hospital appointment management platform that fuses AI-driven symptom triage, real-time priority queuing, blockchain-secured medical records, and a patient digital twin — all wrapped in a premium, cinematic UI.</strong>
</p>

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Setup</a> •
  <a href="#-demo-mode">Demo</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-novelty--what-makes-this-different">Novelty</a> •
  <a href="#-future-roadmap">Roadmap</a>
</p>

---

## 📌 Problem Statement

Traditional hospital booking systems suffer from:
- **Blind scheduling** — patients are booked without any assessment of urgency
- **No intelligent triage** — critical cases wait alongside routine check-ups
- **Zero transparency** — no real-time queue visibility or wait-time estimates
- **Data insecurity** — sensitive medical records lack tamper-proof verification

**MediBook solves all of this** by transforming a standard appointment system into an **AI-Powered Smart Healthcare Orchestrator** — a platform where every booking is intelligently analyzed, prioritized, and secured.

---

## ✨ Key Features

### 🧠 1. AI Symptom Triage Engine
A rule-based neural triage system that analyzes patient symptoms in real-time and assigns a **priority score (0–100)**, severity level (`Low` / `Medium` / `Critical`), and auto-recommends the best-matched specialist.

```
Patient Input: "Severe chest pain, difficulty breathing"
→ Priority Score: 80 | Severity: CRITICAL | Recommended: Cardiologist
```

### 🚨 2. Emergency Priority Booking
One-click emergency slot booking that bypasses normal queues. The AI engine auto-assigns the most relevant available doctor and flags the appointment with visual urgency indicators across all dashboards.

### 🤖 3. Pulse AI Chat Assistant
A floating AI chatbot (bottom-right FAB) where patients can describe symptoms in natural language. The assistant runs real-time triage analysis and provides instant severity alerts with specialist recommendations.

### 🧬 4. Patient Digital Twin
Each patient dashboard features a **Digital Twin** panel — a living, AI-monitored profile showing:
- Current health risk score
- Recent condition tracking
- Blockchain integrity hash for medical record verification

### 🔗 5. Blockchain-Secured Medical Records
Every user record generates a **SHA-256 blockchain hash** on creation/update (computed from `email + name + role + userId`). This hash is displayed in the Digital Twin panel, enabling tamper-proof data integrity verification.

### 📊 6. Smart Priority Queue (Doctor Dashboard)
Doctors see appointments auto-sorted by AI severity score — critical patients surface to the top with pulsing red indicators and AI triage alert cards, ensuring the most urgent cases are never missed.

### 🎯 7. Role-Based Dashboards
Three distinct, purpose-built dashboards:

| Role | Dashboard Capabilities |
|------|----------------------|
| **Patient** | Browse doctors, book appointments, emergency booking, reschedule/cancel, AI chatbot, Digital Twin |
| **Doctor** | Smart priority queue, appointment management (complete/cancel), profile editor, AI triage alerts |
| **Admin** | System-wide statistics, user management, doctor oversight, appointment monitoring |

### ⏰ 8. Smart Reschedule Guard
Appointments can only be rescheduled **at least 2 hours** before the scheduled time — enforced both in UI (disabled button + visual warning) and in business logic.

### 🔌 9. Dual-Mode Architecture
The app runs in two modes seamlessly:
- **Live Mode** — Full-stack with Next.js API + MongoDB backend
- **Demo Mode** — Zero-setup, localStorage-powered simulation with pre-seeded data (toggle with one click)

### 🎨 10. Premium Cinematic UI
- Glassmorphism cards with `backdrop-blur`
- Framer Motion page transitions and micro-animations
- Gradient mesh backgrounds with parallax scrolling
- Floating animated cards on the landing page
- Responsive design across all breakpoints

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Vite + React)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │ Landing  │ │ Patient  │ │ Doctor   │ │ Admin Dashboard   │  │
│  │ Page     │ │Dashboard │ │Dashboard │ │                   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │ AI Chat  │ │Emergency │ │ Digital  │ │ Booking Flow      │  │
│  │ Bot      │ │ Booking  │ │ Twin     │ │                   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────────┘  │
│       │              │              │              │            │
│       ▼              ▼              ▼              ▼            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              AI Triage Engine (aiEngine.ts)              │   │
│  │   Keyword Analysis → Age Factor → Score → Specialist    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│              ┌─────────────┴─────────────┐                     │
│              ▼                           ▼                     │
│     ┌──────────────┐          ┌───────────────┐                │
│     │  Demo Mode   │          │  Live API     │                │
│     │ (localStorage)│          │  (fetch)      │                │
│     └──────────────┘          └───────┬───────┘                │
└───────────────────────────────────────┼────────────────────────┘
                                        │ HTTP/REST
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Next.js App Router)                  │
│  ┌────────────┐ ┌────────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ CORS       │ │ JWT Auth   │ │ Role     │ │ Blockchain   │  │
│  │ Middleware │ │ Middleware │ │ Guard    │ │ Hash (SHA256)│  │
│  └────────────┘ └────────────┘ └──────────┘ └──────────────┘  │
│                                                                 │
│  API Routes:                                                    │
│  POST /api/auth/signup    POST /api/auth/signin                │
│  GET  /api/auth/verify    GET  /api/doctors                    │
│  GET  /api/appointments   POST /api/appointments               │
│  PUT  /api/appointments   GET  /api/users (admin)              │
│  GET  /api/health                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MongoDB (Atlas / Local)                     │
│  ┌──────────────────┐    ┌────────────────────────────────┐    │
│  │ Users Collection │    │ Appointments Collection        │    │
│  │ • email, password│    │ • patientId, doctorId          │    │
│  │ • role, specialty│    │ • date, time, status           │    │
│  │ • blockchainHash │    │ • priorityScore, severityLevel │    │
│  │ • digitalTwin[]  │    │ • aiAnalysis, metadata         │    │
│  │ • isPremium      │    │ • isEmergency                  │    │
│  └──────────────────┘    └────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | Component-based UI with type safety |
| **Build Tool** | Vite 6 | Lightning-fast HMR and bundling |
| **Styling** | Tailwind CSS v4 | Utility-first responsive design |
| **UI Library** | Radix UI + shadcn/ui | Accessible, composable primitives |
| **Animations** | Framer Motion (motion) | Page transitions and micro-interactions |
| **Routing** | React Router v7 | Client-side routing with data mode |
| **Charts** | Recharts | Admin analytics visualizations |
| **Backend** | Next.js 16 (App Router) | REST API with TypeScript |
| **Database** | MongoDB + Mongoose | Document-based data storage |
| **Auth** | JWT + bcryptjs | Stateless authentication with hashed passwords |
| **Security** | SHA-256 Hashing | Blockchain-style data integrity verification |
| **Notifications** | Sonner | Toast notification system |
| **Deployment** | Docker + Docker Compose | Containerized production deployment |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+ and **npm**
- **MongoDB** instance (local, Docker, or Atlas)
- **Docker** (optional, for containerized deployment)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/Digital_Booking_System.git
cd Digital_Booking_System

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment

Create `backend/.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/digital_booking_system
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_ORIGIN=http://localhost:3000
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend (port 3001)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
npm run dev
```

### 4. Open the App

Navigate to `http://localhost:3000` — sign up as Patient, Doctor, or Admin.

---

## ⚡ Demo Mode

**No backend? No problem.** MediBook includes a **zero-config Demo Mode** that simulates the entire backend using `localStorage`.

### Activating Demo Mode
1. If the backend is offline, the auth page shows a **"Enable Demo Mode"** button
2. Click it — the app switches to local simulation instantly
3. All CRUD operations work identically, stored in your browser

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 🩺 Patient | `patient@demo.com` | `demo123` |
| 👨‍⚕️ Doctor | `doctor@demo.com` | `demo123` |
| 👨‍⚕️ Doctor | `doctor2@demo.com` | `demo123` |
| 🔧 Admin | `admin@demo.com` | `demo123` |

### Pre-Seeded Demo Data
- **6 Doctors** across specialties: Cardiology, Pediatrics, Dermatology, Orthopedics, Neurology, General Medicine
- **1 Patient** with 2 pre-booked appointments
- **1 Admin** with system-wide access

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <JWT>`.

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|:----:|-------|
| `POST` | `/auth/signup` | Register new user (bcrypt-hashed password) | ✗ | — |
| `POST` | `/auth/signin` | Login → returns JWT token | ✗ | — |
| `GET` | `/auth/verify` | Validate JWT token | ✓ | Any |
| `GET` | `/doctors` | List all doctors (password excluded) | ✓ | Any |
| `GET` | `/appointments` | Get appointments for current user | ✓ | Patient, Doctor, Admin |
| `POST` | `/appointments` | Book a new appointment | ✓ | Patient |
| `PUT` | `/appointments/:id` | Update appointment status | ✓ | Doctor, Admin |
| `GET` | `/users` | List all users (admin only) | ✓ | Admin |
| `GET` | `/health` | Server health check | ✗ | — |

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker compose up -d --build

# Services:
#   API     → http://localhost:3001
#   MongoDB → localhost:27017

# Stop and cleanup
docker compose down
docker volume rm $(docker volume ls -qf name=Digital_Booking_System_mongo-data)
```

---

## 🏆 Novelty — What Makes This Different

| # | Innovation | Description |
|---|-----------|-------------|
| 1 | **AI Triage Engine** | Not just a booking system — every appointment is risk-scored by an intelligent symptom analysis pipeline |
| 2 | **Emergency Fast-Track** | Critical cases bypass normal queues via AI-assessed severity with auto-specialist matching |
| 3 | **Digital Twin Concept** | Patients have a living health profile that visualizes risk trends and condition history |
| 4 | **Blockchain Data Integrity** | SHA-256 hash-based tamper detection on all medical records (generated on every DB write) |
| 5 | **Dual-Mode Architecture** | Seamless toggle between full-stack (MongoDB) and demo (localStorage) without code changes |
| 6 | **AI Chat Assistant** | Natural-language symptom input with real-time triage feedback and emergency escalation |
| 7 | **Smart Priority Queue** | Doctor view auto-sorts patients by AI severity — critical cases glow red with pulse animations |
| 8 | **Time-Guarded Rescheduling** | Business rule enforcement (2-hour cutoff) with progressive UI disclosure |
| 9 | **Premium Cinematic UI** | Glassmorphism, parallax backgrounds, Framer Motion transitions — hackathon-grade polish |
| 10 | **Microservice-Ready** | Decoupled Vite frontend + Next.js API backend — independently deployable and scalable |

---

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 🖥️ Desktop (1280px+)
- 💻 Laptop (1024px)
- 📱 Tablet (768px)
- 📱 Mobile (320px+)

---

## 🔐 Security Architecture

| Layer | Implementation |
|-------|---------------|
| **Password Storage** | bcryptjs with salted hashing |
| **Authentication** | Stateless JWT tokens (Bearer scheme) |
| **Authorization** | Role-based guards (`requireRole()`) on every protected endpoint |
| **CORS** | Strict origin-based allowlisting via middleware |
| **Data Integrity** | SHA-256 blockchain hash on user records |
| **Input Validation** | Mongoose schema validation + frontend form guards |

> ⚠️ **Disclaimer**: This is a prototype/hackathon project. For production healthcare deployment, implement HIPAA-compliant infrastructure, end-to-end encryption, comprehensive audit logging, and consult healthcare compliance experts.

---

## 📂 Project Structure

```
Digital_Booking_System/
├── src/                              # Frontend (Vite + React)
│   ├── app/
│   │   ├── components/
│   │   │   ├── AIChatbot.tsx         # Floating AI symptom assistant
│   │   │   ├── DashboardHeader.tsx   # Shared dashboard header
│   │   │   ├── DemoModeBanner.tsx    # Demo mode indicator
│   │   │   ├── StatCard.tsx          # Reusable stat card
│   │   │   ├── SystemStatus.tsx      # Backend health checker + demo toggle
│   │   │   └── ui/                   # shadcn/ui primitives
│   │   ├── context/
│   │   │   └── AuthContext.tsx        # Authentication state provider
│   │   ├── data/
│   │   │   └── mockData.ts           # Wireframe mock data
│   │   ├── hooks/
│   │   │   └── useLiveEvents.ts      # Simulated real-time event toasts
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx       # Marketing landing page
│   │   │   ├── AuthPage.tsx          # Login/Signup with demo mode
│   │   │   ├── PatientDashboard.tsx  # Patient portal (Digital Twin, Emergency)
│   │   │   ├── DoctorDashboard.tsx   # Doctor portal (Priority Queue)
│   │   │   ├── DoctorProfile.tsx     # Doctor detail + booking
│   │   │   ├── AdminDashboard.tsx    # System admin overview
│   │   │   └── BookingFlow.tsx       # Step-by-step booking wizard
│   │   ├── utils/
│   │   │   ├── aiEngine.ts           # AI Triage Engine (symptom analysis)
│   │   │   ├── api.ts                # API client (fetch wrapper)
│   │   │   ├── auth.ts               # JWT helpers
│   │   │   └── demoMode.ts           # LocalStorage-based demo simulation
│   │   ├── App.tsx
│   │   └── routes.tsx                # React Router configuration
│   └── styles/
│
├── backend/                           # Backend (Next.js App Router)
│   ├── src/
│   │   ├── app/api/
│   │   │   ├── auth/                 # signup, signin, verify
│   │   │   ├── doctors/              # Doctor listing
│   │   │   ├── appointments/         # CRUD operations
│   │   │   ├── users/                # Admin user management
│   │   │   └── health/               # Health check endpoint
│   │   ├── lib/
│   │   │   ├── mongodb.ts            # Mongoose connection singleton
│   │   │   ├── auth.ts               # JWT verification helper
│   │   │   └── roleGuard.ts          # Role-based access control
│   │   └── models/
│   │       ├── User.ts               # User schema + blockchain hash hook
│   │       └── Appointment.ts        # Appointment schema (AI fields)
│   ├── middleware.ts                  # CORS + JWT middleware
│   └── .env.local                    # Environment variables
│
├── docker-compose.yml                 # Container orchestration
├── package.json                       # Frontend dependencies
└── vite.config.ts                     # Vite build configuration
```

---

## 🔄 Future Roadmap

| Priority | Feature | Description |
|----------|---------|-------------|
| 🔴 High | **WebSocket Real-Time Queue** | Live queue position updates via Socket.io |
| 🔴 High | **Video Consultation (WebRTC)** | In-app telemedicine with peer-to-peer video |
| 🟡 Medium | **Voice-Based Symptom Input** | Web Speech API integration for elderly/accessibility |
| 🟡 Medium | **Multi-Language Support** | i18n with regional language packs |
| 🟡 Medium | **Email/SMS Reminders** | Automated appointment reminders via Twilio/SendGrid |
| 🟢 Low | **Payment Gateway** | Razorpay/Stripe integration for consultation fees |
| 🟢 Low | **Prescription PDF Export** | Auto-generated digital prescriptions |
| 🟢 Low | **Calendar Sync** | Google Calendar / Outlook integration |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Ensure linting and tests pass (`npm run lint && npm test`)
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## 📄 License

MIT © 2026 — Built with ❤️ for smarter healthcare.

---

<p align="center">
  <strong>⭐ If this project impressed you, give it a star! ⭐</strong>
</p>