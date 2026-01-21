import { Router, type Request, type Response } from 'express';
import User from '../models/User.js';
import connectDB from '../config/db.js';

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

  const username = `Linx${code}`;
  
  try {
    // Ensure DB is connected
    await connectDB();

    // Check if user exists
    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ error: '账号不存在，请先注册' });
      return;
    }

    // Login: Verify password
    if (user.password !== password) {
      res.status(401).json({ error: '密码错误' });
      return;
    }

    // Update last login time
    user.lastLoginAt = new Date();
    await user.save();
    
    // Return user without password
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    
    res.json({
      success: true,
      user: userWithoutPassword,
      token: 'mock-token-' + code
    });
  } catch (error: any) {
    console.error('Login error:', error);
    // Return detailed error message for debugging
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
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

  const username = `Linx${code}`;
  
  try {
    // Ensure DB is connected
    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.status(409).json({ error: '该账号已被注册' });
      return;
    }

    // Register: Create new user
    const user = await User.create({
      id: code,
      username,
      password, // In production, hash this!
      nickname: username,
      phone: '',
      isVip: false,
      avatar: avatar || ''
    });
    
    // Return user without password
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    
    res.json({
      success: true,
      user: userWithoutPassword,
      token: 'mock-token-' + code
    });
  } catch (error: any) {
    console.error('Register error:', error);
    // Return detailed error message for debugging
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

export default router;
