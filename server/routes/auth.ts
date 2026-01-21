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
  const user = findUserByUsername(username);

  if (!user) {
    res.status(401).json({ error: '账号不存在，请先注册' });
    return;
  }

  // Login: Verify password
  if (user.password !== password) {
    res.status(401).json({ error: '密码错误' });
    return;
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    user: userWithoutPassword,
    token: 'mock-token-' + code
  });
});

router.post('/register', async (req: Request, res: Response) => {
  const { code, password, avatar } = req.body;
  
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
  const existingUser = findUserByUsername(username);

  if (existingUser) {
    res.status(409).json({ error: '该账号已被注册' });
    return;
  }

  // Register: Create new user
  const user = {
    id: code,
    username,
    password, // In production, hash this!
    nickname: username,
    phone: '',
    isVip: false,
    joinDate: new Date().toISOString().split('T')[0],
    avatar: avatar || '' // Store avatar
  };
  addUser(user);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    user: userWithoutPassword,
    token: 'mock-token-' + code
  });
});

export default router;
