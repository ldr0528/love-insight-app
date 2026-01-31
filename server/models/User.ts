import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  username: string;
  password?: string;
  nickname: string;
  phone: string;
  email?: string;
  isVip: boolean;
  vipExpiresAt?: Date | null;
  isBlacklisted: boolean;
  joinDate: string;
  avatar: string;
  petType: 'cat' | 'dog' | 'chicken' | 'rabbit' | 'panda' | 'hamster' | 'koala' | 'fox' | 'lion' | null;
  petName: string | null;
  lastLoginAt: Date;
  currentSessionToken?: string;
  loginHistory: {
    ip: string;
    timestamp: Date;
    device?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

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
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined to not conflict
  },
  isVip: {
    type: Boolean,
    default: false,
  },
  vipExpiresAt: {
    type: Date,
    default: null,
  },
  isBlacklisted: {
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
  petType: {
    type: String,
    enum: ['cat', 'dog', 'chicken', 'rabbit', 'panda', 'hamster', 'koala', 'fox', 'lion', null],
    default: null,
  },
  petName: {
    type: String,
    default: null,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
  currentSessionToken: {
    type: String,
    default: null
  },
  loginHistory: [{
    ip: String,
    timestamp: { type: Date, default: Date.now },
    device: String
  }]
}, {
  timestamps: true,
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
