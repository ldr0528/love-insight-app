import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: '',
  },
  isVip: {
    type: Boolean,
    default: false,
  },
  joinDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  avatar: {
    type: String,
    default: '',
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
