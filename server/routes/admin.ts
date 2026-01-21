import { Router, type Request, type Response } from 'express';
import { users, findUserById, deleteUserById } from '../data/store.js';

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
router.get('/users', (req: Request, res: Response) => {
  res.json({ success: true, users });
});

// Toggle VIP
router.post('/users/:id/toggle-vip', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = findUserById(id);
  if (user) {
    user.isVip = !user.isVip;
    res.json({ success: true, user });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

// Delete User
router.delete('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = deleteUserById(id);
  if (deleted) {
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

export default router;
