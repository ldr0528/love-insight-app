import { Router, type Request, type Response } from 'express';
import { findUserByUsername, addUser } from '../data/store.js';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { code, password } = req.body;
  
  if (!code || code.length !== 4) {
    res.status(400).json({ error: 'Please provide a 4-digit code' });
    return;
  }
  
  if (!password) {
    res.status(400).json({ error: 'Please provide a password' });
    return;
  }

  const username = `Lin${code}`;
  
  // Check if user exists
  let user = findUserByUsername(username);

  if (user) {
    // Login: Verify password
    if (user.password !== password) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }
  } else {
    // Register: Create new user
    user = {
      id: code,
      username,
      password, // In production, hash this!
      nickname: username,
      phone: '',
      isVip: false,
      joinDate: new Date().toISOString().split('T')[0]
    };
    addUser(user);
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    user: userWithoutPassword,
    token: 'mock-token-' + code
  });
});

export default router;
