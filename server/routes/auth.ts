import { Router, type Request, type Response } from 'express';
import User from '../models/User.js';
import connectDB from '../config/db.js';
import { sendVerificationEmail } from '../services/email.js';

const router = Router();

// In-memory store for verification codes (Use Redis in production)
const verificationCodes: Record<string, { code: string; expires: number }> = {};

router.post('/send-code', async (req: Request, res: Response) => {
  const { email } = req.body;
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: '请输入有效的邮箱地址' });
    return;
  }

  // Check if email already exists
  await connectDB();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ error: '该邮箱已被注册' });
    return;
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store code (5 minutes expiration)
  verificationCodes[email] = {
    code,
    expires: Date.now() + 5 * 60 * 1000
  };

  const sent = await sendVerificationEmail(email, code);
  
  if (sent) {
    res.json({ success: true, message: '验证码已发送' });
  } else {
    res.status(500).json({ error: '邮件发送失败，请稍后重试' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    res.status(400).json({ error: '请输入有效的11位手机号码' });
    return;
  }
  
  if (!password) {
    res.status(400).json({ error: '请输入密码' });
    return;
  }

  const username = phone;
  
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

    // Check VIP expiration
    if (user.isVip && user.vipExpiresAt) {
      if (new Date() > new Date(user.vipExpiresAt)) {
        user.isVip = false;
        user.vipExpiresAt = null; // Optional: clear expiration date
      }
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
      token: 'mock-token-' + phone
    });
  } catch (error: any) {
    console.error('Login error:', error);
    // Return detailed error message for debugging
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  const { phone, password, avatar, email, code } = req.body;
  
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    res.status(400).json({ error: '请输入有效的11位手机号码' });
    return;
  }
  
  if (!password) {
    res.status(400).json({ error: '请输入密码' });
    return;
  }

  // Verify email code if email is provided
  if (email) {
    if (!verificationCodes[email] || 
        verificationCodes[email].code !== code || 
        Date.now() > verificationCodes[email].expires) {
      res.status(400).json({ error: '验证码错误或已过期' });
      return;
    }
    // Clean up used code
    delete verificationCodes[email];
  }

  const username = phone;
  
  try {
    // Ensure DB is connected
    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.status(409).json({ error: '该手机号已被注册' });
      return;
    }

    // Register: Create new user
    const user = await User.create({
      id: phone.slice(-4), // Use last 4 digits as short ID
      username,
      password, // In production, hash this!
      nickname: `用户${phone.slice(-4)}`,
      phone,
      email: email || undefined,
      isVip: false,
      avatar: avatar || ''
    });
    
    // Return user without password
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    
    res.json({
      success: true,
      user: userWithoutPassword,
      token: 'mock-token-' + phone
    });
  } catch (error: any) {
    console.error('Register error:', error);
    // Return detailed error message for debugging
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

export default router;
