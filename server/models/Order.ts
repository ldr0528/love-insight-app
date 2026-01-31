import mongoose, { Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  userId: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  method: 'epay';
  type: 'report' | 'vip';
  plan?: string; // 'weekly' | 'monthly' | 'permanent'
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  method: {
    type: String,
    default: 'epay',
  },
  type: {
    type: String,
    enum: ['report', 'vip'],
    default: 'report',
  },
  plan: {
    type: String,
    required: false,
  }
}, {
  timestamps: true,
});

// Auto-delete orders after 24 hours (86400 seconds)
// This serves as a safety net for abandoned/pending orders.
// Successful orders will be deleted immediately by the application logic.
orderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
