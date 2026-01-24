import { Router, type Request, type Response } from 'express';
import User from '../models/User';
import VerificationCode from '../models/VerificationCode';
import connectDB from '../config/db';
import { sendVerificationEmail } from '../services/email';

const router = Router();

router.post('/send-code', async (req: Request, res: Response) => {
  const { email } = req.body;
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: '请输入有效的邮箱地址' });
    return;
  }

  try {
    await connectDB();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: '该邮箱已被注册' });
      return;
    }

    // Check rate limit (1 minute)
    const existingCode = await VerificationCode.findOne({ email });
    if (existingCode) {
      const timeSinceLastSent = Date.now() - existingCode.lastSent.getTime();
      if (timeSinceLastSent < 60 * 1000) {
        res.status(429).json({ error: '发送太频繁，请稍后再试' });
        return;
      }
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Update or Create code in DB
    if (existingCode) {
      existingCode.code = code;
      existingCode.lastSent = new Date();
      existingCode.createdAt = new Date(); // Reset expiration timer
      await existingCode.save();
    } else {
      await VerificationCode.create({
        email,
        code,
        lastSent: new Date()
      });
    }

    const sent = await sendVerificationEmail(email, code);
    
    if (sent) {
      res.json({ success: true, message: '验证码已发送' });
    } else {
      res.status(500).json({ error: '邮件发送失败，请稍后重试' });
    }
  } catch (error: any) {
    console.error('Send code error:', error);
    res.status(500).json({ error: '服务器错误' });
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

    // Check if user is blacklisted
    if (user.isBlacklisted) {
      res.status(403).json({ error: '该账号已被禁用，请联系客服' });
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
    await connectDB();
    const validCode = await VerificationCode.findOne({ email, code });
    if (!validCode) {
      res.status(400).json({ error: '验证码错误或已过期' });
      return;
    }
    // Clean up used code
    await VerificationCode.deleteOne({ _id: validCode._id });
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
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5), // Unique ID
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

// Get Current User Profile (Refresh)
router.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // In a real app, verify JWT here. 
  // For this mock, we extract phone/id from the mock token or just rely on a query param/header if we had one.
  // Since our mock token is "mock-token-PHONE", let's extract the phone.
  const token = authHeader.split(' ')[1];
  const phone = token.replace('mock-token-', '');

  try {
    await connectDB();
    const user = await User.findOne({ phone });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check VIP expiration
    if (user.isVip && user.vipExpiresAt) {
      if (new Date() > new Date(user.vipExpiresAt)) {
        user.isVip = false;
        user.vipExpiresAt = null;
        await user.save();
      }
    }

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Pet Info
router.post('/pet', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const phone = token.replace('mock-token-', '');
  const { petType, petName } = req.body;

  try {
    await connectDB();
    const user = await User.findOne({ phone });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.petType = petType;
    user.petName = petName;
    await user.save();

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
