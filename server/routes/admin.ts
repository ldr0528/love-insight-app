import { Router, type Request, type Response } from 'express';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const router = Router();

// Admin Login
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin888') {
    res.json({ success: true, token: 'admin-mock-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get Users
router.get('/users', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Toggle VIP
router.post('/users/:id/toggle-vip', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await connectDB();
    const user = await User.findOne({ id });
    if (user) {
      user.isVip = !user.isVip;
      await user.save();
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Toggle VIP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete User
router.delete('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await connectDB();
    const result = await User.deleteOne({ id });
    if (result.deletedCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
