import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  date: {
    type: String, // Storing as YYYY-MM-DD string as per frontend
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  reason: {
    type: String
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  priorityScore: {
    type: Number,
    default: 0
  },
  severityLevel: {
    type: String,
    enum: ['Low', 'Medium', 'Critical'],
    default: 'Low'
  },
  aiAnalysis: {
    type: String
  },
  metadata: {
    condition: String,
    age: String,
    gender: String,
    cause: String
  },
  // Added for Orchestrator V2 Features
  tokenNumber: {
    type: Number
  },
  estimatedWaitTime: {
    type: Number // in minutes
  },
  consultationType: {
    type: String,
    enum: ['in-person', 'teleconsultation', 'voice'],
    default: 'in-person'
  },
  followUpRecommended: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: String
  },
  familyMemberId: {
    type: String // Corresponds to the _id inside user.familyMembers
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  }
}, {
  timestamps: true
});

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
