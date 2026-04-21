# MediBook - Hospital Appointment Management System

## 🏥 Overview

MediBook is a comprehensive hospital appointment management system that streamlines patient scheduling and reduces wait times through intelligent queue management.

## ✨ Features

### Landing Page
- Professional marketing page showcasing system benefits
- Clear call-to-action for getting started
- Feature highlights and how-it-works section

### Authentication System
- Multi-role signup and login (Patient, Doctor, Admin)
- Secure authentication via Supabase
- Quick start with sample data generator

### Patient Dashboard
- View upcoming and past appointments
- Search and filter doctors by name or specialty
- Book appointments with preferred doctors
- Real-time availability status

### Doctor Profile & Booking Flow
- Detailed doctor information (specialty, experience, rating)
- Interactive time slot selection
- Date picker for appointment scheduling
- Confirmation popup with appointment details
- Additional notes field for symptoms

### Doctor Dashboard
- Manage personal profile (specialty, experience, availability)
- View and manage all appointments
- Complete or cancel appointments
- Today's schedule overview
- Patient information for each appointment

### Admin Dashboard
- System-wide overview with statistics
- View all registered users
- Monitor all doctors and their availability
- Track all appointments across the system
- Role-based user management

## 🚀 Quick Start

### 1. Initialize Sample Data
On the authentication page, click "Create Sample Data" to populate the system with:
- 1 Admin account
- 4 Doctor accounts with different specialties
- Ready-to-use test accounts

### 2. Demo Accounts

**Admin Access:**
- Email: `admin@medibook.com`
- Password: `admin123`

**Doctor Accounts:**
- Email: `dr.smith@medibook.com` - Cardiologist
- Email: `dr.johnson@medibook.com` - Pediatrician
- Email: `dr.williams@medibook.com` - Orthopedic Surgeon
- Email: `dr.brown@medibook.com` - Dermatologist
- Password for all: `doctor123`

**Patient Account:**
- Create your own via the Sign Up page
- Select "Patient" as your role

## 📋 User Workflows

### As a Patient:
1. Sign up and create an account
2. Browse available doctors
3. Click on a doctor to view their profile
4. Select a date and time slot
5. Add optional notes about your visit
6. Confirm booking
7. View appointment confirmation
8. Track appointments from your dashboard

### As a Doctor:
1. Log in with doctor credentials
2. Update your profile (specialty, experience, availability)
3. View today's appointments
4. Mark appointments as completed or cancelled
5. See patient notes for each appointment

### As an Admin:
1. Log in with admin credentials
2. View system-wide statistics
3. Monitor all users in the system
4. Track all doctors and their status
5. Oversee all appointments
6. Analyze usage patterns

## 🛠️ Technical Stack

- **Frontend:** React + TypeScript
- **Routing:** React Router (Data Mode)
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI
- **Authentication:** Supabase Auth
- **Backend:** Supabase Edge Functions (Hono)
- **Database:** Supabase KV Store
- **Notifications:** Sonner (Toast)

## 🔐 Security Notes

⚠️ **Important:** This is a demo application. For production use in healthcare:
- Implement HIPAA-compliant infrastructure
- Use proper encryption for sensitive health data
- Add comprehensive audit logging
- Implement proper access controls
- Follow healthcare data regulations (HIPAA, GDPR, etc.)

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## 🎯 Key Benefits

1. **Reduced Wait Times:** Intelligent scheduling prevents overbooking
2. **Smart Booking:** Real-time availability and instant confirmations
3. **Multi-Role Support:** Dedicated interfaces for patients, doctors, and admins
4. **Real-Time Updates:** Instant appointment notifications and status changes
5. **Easy Management:** Intuitive dashboards for all user types

## 💡 Tips for Testing

1. Create a patient account first
2. Log in and explore the patient dashboard
3. Browse doctors and book an appointment
4. Log out and log in as a doctor to see the appointment
5. Mark the appointment as completed
6. Log in as admin to see the full system overview
7. Try booking multiple appointments to see queue management

## 🔄 Future Enhancements

Potential additions for production deployment:
- Email/SMS appointment reminders
- Video consultation integration
- Medical history tracking
- Prescription management
- Insurance integration
- Payment processing
- Advanced analytics and reporting
- Multi-language support
- Calendar sync (Google Calendar, Outlook)

---

**Note:** This is a prototype application designed for demonstration purposes. Always consult with healthcare compliance experts before deploying in a real medical environment.
