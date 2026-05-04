import mongoose from 'mongoose';

const BranchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contactNumber: String,
  facilities: [String],
  operatingHours: {
    open: String,
    close: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  currentCrowdLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Low'
  },
  waitTimes: {
    general: { type: Number, default: 15 },
    emergency: { type: Number, default: 0 },
    specialist: { type: Number, default: 30 }
  }
}, {
  timestamps: true
});

export default mongoose.models.Branch || mongoose.model('Branch', BranchSchema);
