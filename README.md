<div align="center">

# 🏥 MediBook

### AI-Powered Smart Healthcare Orchestrator

**An intelligent, full-stack hospital appointment management platform featuring AI-driven symptom triage, real-time priority queuing, blockchain-secured medical records, and a patient digital twin — wrapped in a premium cinematic UI.**

<br/>

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)

<br/>

[Features](#-features) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Quick Start](#-quick-start) · [Demo Mode](#-demo-mode) · [API Reference](#-api-reference) · [Roadmap](#-roadmap)

</div>

---

## 📌 Problem Statement

Traditional hospital booking systems are fundamentally broken:

- **Blind scheduling** — patients are booked without any assessment of urgency
- **No intelligent triage** — critical cases wait in line alongside routine check-ups
- **Zero transparency** — no real-time queue visibility or wait-time estimates
- **Data insecurity** — sensitive medical records lack tamper-proof verification

**MediBook solves all of this** by transforming a standard booking system into an **AI-Powered Smart Healthcare Orchestrator** — where every appointment is intelligently analyzed, prioritized, and secured.

---

## ✨ Features

### 🧠 AI Symptom Triage Engine
A rule-based triage system that analyzes patient-described symptoms in real-time and assigns a **priority score (0–100)**, a severity level (`Low` / `Medium` / `Critical`), and auto-recommends the best-matched specialist.

```
Input:  "Severe chest pain, difficulty breathing"
Output: Priority Score: 80 | Severity: CRITICAL | Specialist: Cardiologist
```

### 🚨 Emergency Priority Booking
One-click emergency slot booking that bypasses normal queues. The AI engine auto-assigns the most relevant available doctor and flags the appointment with visual urgency indicators across all dashboards.

### 🤖 Pulse AI Chat Assistant
A floating AI chatbot where patients describe symptoms in natural language. The assistant performs real-time triage and provides instant severity alerts with specialist recommendations.

### 🧬 Patient Digital Twin
Each patient dashboard features a **Digital Twin** panel — a living, AI-monitored profile showing:
- Current health risk score
- Recent condition tracking
- Blockchain integrity hash for medical record verification

### 🔗 Blockchain-Secured Medical Records
Every user record generates a **SHA-256 blockchain hash** on creation and update (derived from `email + name + role + userId`). The hash is displayed in the Digital Twin panel, enabling tamper-proof data integrity checks.

### 📊 Smart Priority Queue (Doctor Dashboard)
Doctors see appointments auto-sorted by AI severity score. Critical patients surface to the top with pulsing red indicators and AI triage alert cards, ensuring the most urgent cases are never missed.

### 🎯 Role-Based Dashboards

| Role | Capabilities |
|------|-------------|
| **Patient** | Browse doctors, book appointments, emergency booking, reschedule/cancel, AI chatbot, Digital Twin |
| **Doctor** | Smart priority queue, appointment management (complete/cancel), profile editor, AI triage alerts |
| **Admin** | System-wide statistics, user management, doctor oversight, appointment monitoring |

### ⏰ Smart Reschedule Guard
Appointments can only be rescheduled **at least 2 hours** before the scheduled time — enforced both in the UI and in business logic.

### 🔌 Dual-Mode Architecture
The app runs in two modes seamlessly:
- **Live Mode** — Full-stack with Next.js API + MongoDB backend
- **Demo Mode** — Zero-setup, `localStorage`-powered simulation with pre-seeded data (one-click toggle)

### 🎨 Premium Cinematic UI
- Glassmorphism cards with `backdrop-blur`
- Framer Motion page transitions and micro-animations
- Gradient mesh backgrounds with parallax scrolling
- Floating animated cards on the landing page
- Fully responsive across all breakpoints

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT (Vite + React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐   │
│  │ Landing  │  │ Patient  │  │  Doctor  │  │ Admin         │   │
│  │  Page    │  │Dashboard │  │Dashboard │  │ Dashboard     │   │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐   │
│  │ Pulse AI │  │Emergency │  │ Digital  │  │ Booking Flow  │   │
│  │ Chatbot  │  │ Booking  │  │  Twin    │  │               │   │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘   │
│                           │                                     │
│              ┌────────────▼────────────┐                        │
│              │   AI Triage Engine      │                        │
│              │ (aiEngine.ts)           │                        │
│              │ Keywords → Age Factor   │                        │
│              │ → Score → Specialist    │                        │
│              └────────────┬────────────┘                        │
│                 ┌─────────┴──────────┐                          │
│                 ▼                    ▼                           │
│        ┌──────────────┐    ┌──────────────┐                     │
│        │  Demo Mode   │    │  Live API    │                     │
│        │(localStorage)│    │   (fetch)    │                     │
│        └──────────────┘    └──────┬───────┘                     │
└───────────────────────────────────┼─────────────────────────────┘
                                    │ HTTP / REST
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Next.js App Router)                   │
│  ┌────────────┐  ┌────────────┐  ┌──────────┐  ┌───────────┐  │
│  │    CORS    │  │  JWT Auth  │  │   Role   │  │Blockchain │  │
│  │ Middleware │  │ Middleware │  │  Guard   │  │  SHA-256  │  │
│  └────────────┘  └────────────┘  └──────────┘  └───────────┘  │
│                                                                 │
│  POST /api/auth/signup      POST /api/auth/signin              │
│  GET  /api/auth/verify      GET  /api/doctors                  │
│  GET  /api/appointments     POST /api/appointments             │
│  PUT  /api/appointments/:id GET  /api/users (admin)            │
│  GET  /api/health                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │  Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MongoDB (Atlas / Local)                       │
│  ┌─────────────────────┐   ┌─────────────────────────────────┐ │
│  │   Users Collection  │   │     Appointments Collection     │ │
│  │  email, password    │   │  patientId, doctorId            │ │
│  │  role, specialty    │   │  date, time, status             │ │
│  │  blockchainHash     │   │  priorityScore, severityLevel   │ │
│  │  digitalTwin[]      │   │  aiAnalysis, isEmergency        │ │
│  └─────────────────────┘   └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | Component-based UI with full type safety |
| **Build Tool** | Vite 6 | Lightning-fast HMR and optimized bundling |
| **Styling** | Tailwind CSS v4 | Utility-first responsive design |
| **UI Components** | Radix UI + shadcn/ui | Accessible, composable component primitives |
| **Animations** | Framer Motion (`motion`) | Page transitions and micro-interactions |
| **Routing** | React Router v7 | Client-side routing with data mode |
| **Charts** | Recharts | Admin analytics visualizations |
| **Backend** | Next.js 16 (App Router) | TypeScript REST API |
| **Database** | MongoDB + Mongoose | Document-based data storage |
| **Auth** | JWT + bcryptjs | Stateless authentication with hashed passwords |
| **Security** | SHA-256 Hashing | Blockchain-style data integrity verification |
| **Notifications** | Sonner | Toast notification system |
| **Deployment** | Docker + Docker Compose | Containerized production deployment |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20+
- **npm** or **pnpm**
- **MongoDB** (local, Docker, or Atlas)
- **Docker** *(optional, for containerized deployment)*

### 1. Clone & Install

```bash
git clone https://github.com/venkatesh0029/MediBook.git
cd MediBook

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
MONGODB_URI=mongodb://localhost:27017/medibook
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_ORIGIN=http://localhost:5173
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend (port 3001)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
npm run dev
```

### 4. Open the App

Navigate to `http://localhost:5173` and sign up as a **Patient**, **Doctor**, or **Admin**.

---

## ⚡ Demo Mode

**No backend? No problem.** MediBook includes a **zero-config Demo Mode** that simulates the entire backend using `localStorage`.

### Activating Demo Mode

1. If the backend is offline, the auth page shows an **"Enable Demo Mode"** button
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

- **6 Doctors** across: Cardiology, Pediatrics, Dermatology, Orthopedics, Neurology, General Medicine
- **1 Patient** with 2 pre-booked appointments
- **1 Admin** with system-wide access

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <JWT>`.

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `POST` | `/auth/signup` | Register a new user (bcrypt-hashed password) | ✗ | — |
| `POST` | `/auth/signin` | Login and receive a JWT token | ✗ | — |
| `GET` | `/auth/verify` | Validate a JWT token | ✓ | Any |
| `GET` | `/doctors` | List all doctors (passwords excluded) | ✓ | Any |
| `GET` | `/appointments` | Get appointments for the current user | ✓ | Patient, Doctor, Admin |
| `POST` | `/appointments` | Book a new appointment | ✓ | Patient |
| `PUT` | `/appointments/:id` | Update appointment status | ✓ | Doctor, Admin |
| `GET` | `/users` | List all users | ✓ | Admin |
| `GET` | `/health` | Server health check | ✗ | — |

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker compose up -d --build

# Services:
#   API     → http://localhost:3001
#   MongoDB → localhost:27017

# Stop and clean up
docker compose down
docker volume rm $(docker volume ls -qf name=medibook_mongo-data)
```

---

## 📂 Project Structure

```
MediBook/
├── src/                               # Frontend (Vite + React)
│   ├── components/
│   │   ├── AIChatbot.tsx              # Floating AI symptom assistant
│   │   ├── DashboardHeader.tsx        # Shared dashboard header
│   │   ├── DemoModeBanner.tsx         # Demo mode indicator
│   │   ├── StatCard.tsx               # Reusable stat display card
│   │   ├── SystemStatus.tsx           # Backend health checker + demo toggle
│   │   └── ui/                        # shadcn/ui primitives
│   ├── context/
│   │   └── AuthContext.tsx            # Authentication state provider
│   ├── hooks/
│   │   └── useLiveEvents.ts           # Simulated real-time event toasts
│   ├── pages/
│   │   ├── LandingPage.tsx            # Marketing landing page
│   │   ├── AuthPage.tsx               # Login/Signup with demo mode toggle
│   │   ├── PatientDashboard.tsx       # Patient portal (Digital Twin, Emergency)
│   │   ├── DoctorDashboard.tsx        # Doctor portal (Priority Queue)
│   │   ├── DoctorProfile.tsx          # Doctor detail + booking
│   │   ├── AdminDashboard.tsx         # System admin overview
│   │   └── BookingFlow.tsx            # Step-by-step booking wizard
│   └── utils/
│       ├── aiEngine.ts                # AI Triage Engine (symptom analysis)
│       ├── api.ts                     # Fetch wrapper / API client
│       ├── auth.ts                    # JWT helpers
│       └── demoMode.ts                # localStorage-based demo simulation
│
├── backend/                           # Backend (Next.js App Router)
│   └── src/
│       ├── app/api/
│       │   ├── auth/                  # signup, signin, verify
│       │   ├── doctors/               # Doctor listing
│       │   ├── appointments/          # CRUD operations
│       │   ├── users/                 # Admin user management
│       │   └── health/                # Health check endpoint
│       ├── lib/
│       │   ├── mongodb.ts             # Mongoose connection singleton
│       │   ├── auth.ts                # JWT verification helper
│       │   └── roleGuard.ts           # Role-based access control
│       └── models/
│           ├── User.ts                # User schema + blockchain hash hook
│           └── Appointment.ts         # Appointment schema (AI fields)
│
├── docker-compose.yml                 # Container orchestration
├── package.json                       # Frontend dependencies
└── vite.config.ts                     # Vite build configuration
```

---

## 🔐 Security

| Layer | Implementation |
|-------|---------------|
| **Password Storage** | bcryptjs with salted hashing |
| **Authentication** | Stateless JWT tokens (Bearer scheme) |
| **Authorization** | Role-based guards (`requireRole()`) on every protected endpoint |
| **CORS** | Strict origin-based allowlisting via middleware |
| **Data Integrity** | SHA-256 blockchain hash on user records |
| **Input Validation** | Mongoose schema validation + frontend form guards |

> ⚠️ **Disclaimer:** MediBook is a prototype. For production healthcare deployment, implement HIPAA-compliant infrastructure, end-to-end encryption, comprehensive audit logging, and consult healthcare compliance experts.

---

## 🏆 What Makes MediBook Different

| # | Innovation | Description |
|---|-----------|-------------|
| 1 | **AI Triage Engine** | Every appointment is risk-scored by an intelligent symptom analysis pipeline — not just a slot-picker |
| 2 | **Emergency Fast-Track** | Critical cases bypass the queue via AI-assessed severity with auto-specialist matching |
| 3 | **Patient Digital Twin** | A living health profile that visualizes risk trends and condition history per patient |
| 4 | **Blockchain Data Integrity** | SHA-256 hash-based tamper detection on all medical records, generated on every DB write |
| 5 | **Dual-Mode Architecture** | Seamless toggle between full-stack (MongoDB) and demo (localStorage) with zero code changes |
| 6 | **AI Chat Assistant** | Natural-language symptom input with real-time triage feedback and emergency escalation |
| 7 | **Smart Priority Queue** | Doctor view auto-sorts patients by AI severity — critical cases pulse red at the top |
| 8 | **Time-Guarded Rescheduling** | 2-hour cutoff rule enforced in both UI and business logic with progressive disclosure |

---

## 🔄 Roadmap

| Priority | Feature | Description |
|----------|---------|-------------|
| 🔴 High | WebSocket Real-Time Queue | Live queue position updates via Socket.io |
| 🔴 High | Video Consultation (WebRTC) | In-app telemedicine with peer-to-peer video |
| 🟡 Medium | Voice-Based Symptom Input | Web Speech API for elderly/accessibility use cases |
| 🟡 Medium | Email/SMS Reminders | Automated appointment reminders via Twilio/SendGrid |
| 🟡 Medium | Multi-Language Support | i18n with regional language packs |
| 🟢 Low | Payment Gateway | Razorpay/Stripe integration for consultation fees |
| 🟢 Low | Prescription PDF Export | Auto-generated digital prescriptions |
| 🟢 Low | Calendar Sync | Google Calendar / Outlook integration |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please ensure your code passes linting before submitting a PR.

---

## 📄 License

MIT © 2026 — Built with ❤️ for smarter healthcare.

---

<div align="center">

⭐ **If MediBook impressed you, drop a star!** ⭐

</div>
