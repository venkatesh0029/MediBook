const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Database URI - directly using the one from .env.local for simplicity in this standalone script
const MONGODB_URI = 'mongodb://localhost:27017/digital_booking';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  specialty: String,
  experience: String,
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  available: { type: Boolean, default: true }
});

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  reason: String,
  notes: String
});

const User = mongoose.model('User', UserSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Clear existing data
    await User.deleteMany({});
    await Appointment.deleteMany({});
    console.log('Cleared existing data.');

    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Create Users
    const patient = await User.create({
      email: 'patient@demo.com',
      password: hashedPassword,
      name: 'John Patient',
      role: 'patient'
    });

    const doctor = await User.create({
      email: 'doctor@demo.com',
      password: hashedPassword,
      name: 'Dr. Sarah Smith',
      role: 'doctor',
      specialty: 'Cardiologist',
      experience: '12 years',
      rating: 4.8,
      reviewCount: 120,
      available: true
    });

    const admin = await User.create({
      email: 'admin@demo.com',
      password: hashedPassword,
      name: 'System Admin',
      role: 'admin'
    });

    console.log('Users created successfully.');

    // Create Sample Appointments
    await Appointment.create({
      patientId: patient._id,
      patientName: patient.name,
      doctorId: doctor._id,
      doctorName: doctor.name,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      status: 'scheduled',
      reason: 'Regular cardiological checkup'
    });

    console.log('Sample appointments created successfully.');
    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
