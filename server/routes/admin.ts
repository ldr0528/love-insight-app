import { Router, type Request, type Response } from 'express';

const router = Router();

// Mock Data
let MOCK_USERS = [
  { id: '1001', username: 'Lin1001', nickname: 'Lin1001', phone: '13800138000', isVip: false, joinDate: '2023-01-01' },
  { id: '1002', username: 'Lin1002', nickname: 'Lin1002', phone: '13800138001', isVip: true, joinDate: '2023-01-02' },
  { id: '1003', username: 'Lin1003', nickname: 'Lin1003', phone: '13800138002', isVip: false, joinDate: '2023-01-03' },
  { id: '8888', username: 'Lin8888', nickname: 'Lin8888', phone: '13888888888', isVip: true, joinDate: '2023-05-20' },
];

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
  res.json({ success: true, users: MOCK_USERS });
});

// Toggle VIP
router.post('/users/:id/toggle-vip', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = MOCK_USERS.find(u => u.id === id);
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
  MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
  res.json({ success: true });
});

export default router;
