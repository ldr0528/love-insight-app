import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // One code per email at a time
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Automatically delete after 300 seconds (5 minutes)
  },
  lastSent: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.VerificationCode || mongoose.model('VerificationCode', verificationCodeSchema);
