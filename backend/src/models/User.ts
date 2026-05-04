import mongoose from 'mongoose';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  // Fields specifically for doctors
  specialty: {
    type: String,
    required: function(this: any) { return this.role === 'doctor'; }
  },
  experience: String,
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  // Orchestrator features
  isPremium: {
    type: Boolean,
    default: false
  },
  blockchainHash: {
    type: String
  },
  location: {
    distance: String,
    coordinates: [Number]
  },
  digitalTwin: [{
    condition: String,
    dateRecorded: String,
    severity: String,
    status: String
  }],
  // Added for Orchestrator V2 Features
  familyMembers: [{
    name: String,
    relation: String,
    age: Number,
    gender: String
  }],
  preferences: {
    seniorMode: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
    notifications: {
      whatsapp: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      email: { type: Boolean, default: true }
    }
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete (ret as any).password;
      return ret;
    }
  }
});

// Generate Blockchain hash on save
UserSchema.pre('save', function(next) {
  if (this.isModified('email') || this.isModified('name') || this.isModified('role')) {
    const dataString = `${this.email}:${this.name}:${this.role}:${this._id.toString()}`;
    this.blockchainHash = crypto.createHash('sha256').update(dataString).digest('hex');
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
