import { Router, type Request, type Response } from 'express';
import User from '../models/User.js';
import connectDB from '../config/db.js';
import { sendVIPNotificationEmail } from '../services/email.js';

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

// Set VIP Status (Advanced)
router.post('/users/:id/set-vip', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isVip, expiresAt } = req.body;
  
  try {
    await connectDB();
    const user = await User.findById(id);
    if (user) {
      const wasVip = user.isVip;
      
      user.isVip = isVip;
      user.vipExpiresAt = expiresAt || null;
      await user.save();
      
      // If user became VIP (and wasn't before, or just renewed), send email
      // Here we assume "new VIP" means setting isVip to true. 
      // You can add logic to only send if !wasVip if needed, but "renewal" might also warrant an email?
      // The prompt says "if system detects added VIP user", usually implies new status.
      // Let's send it if isVip is true.
      if (isVip && user.email) {
        // Run asynchronously, don't block response
        sendVIPNotificationEmail(user.email).catch(err => console.error('Failed to send VIP email:', err));
      }

      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Set VIP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Toggle VIP (Legacy, kept for compatibility if needed, but AdminDashboard uses set-vip now)
router.post('/users/:id/toggle-vip', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await connectDB();
    const user = await User.findById(id);
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

// Toggle Blacklist Status
router.post('/users/:id/toggle-blacklist', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await connectDB();
    const user = await User.findById(id);
    if (user) {
      user.isBlacklisted = !user.isBlacklisted;
      await user.save();
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Toggle blacklist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete User
router.delete('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await connectDB();
    const result = await User.findByIdAndDelete(id);
    if (result) {
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
