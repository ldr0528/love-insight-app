import { Router, type Request, type Response } from 'express';
import User from '../models/User.js';
import VerificationCode from '../models/VerificationCode.js';
import connectDB from '../config/db.js';
import { sendVerificationEmail } from '../services/email.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/send-code', async (req: Request, res: Response) => {
  const { email, type = 'register' } = req.body;
  console.log('[Auth] Send Code Request:', { email, type }); // Debug log
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {    res.status(400).json({ error: '请输入有效的邮箱地址' });
    return;
  }

  try {
    await connectDB();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    
    if (type === 'register') {
      if (existingUser) {
        res.status(409).json({ error: '该邮箱已被注册' });
        return;
      }
    } else if (type === 'reset') {
      if (!existingUser) {
        res.status(404).json({ error: '该邮箱未注册' });
        return;
      }
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

router.post('/reset-password', async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    res.status(400).json({ error: '缺少必要参数' });
    return;
  }

  try {
    await connectDB();

    // Verify code
    const validCode = await VerificationCode.findOne({ email, code });
    if (!validCode) {
      res.status(400).json({ error: '验证码错误或已过期' });
      return;
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Delete used code
    await VerificationCode.deleteOne({ _id: validCode._id });

    res.json({ success: true, message: '密码重置成功' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// Helper to get client IpIP
const getClientIp = (req: Request): string => {
  return (req.headers['x-forwarded-for'] as string || '').split(',')[0].trim() || req.ip || '127.0.0.1';
};

router.post('/login', async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  const ip = getClientIp(req);
  const device = req.headers['user-agent'] || 'Unknown Device';
  
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

    // --- Login Security Check: Frequent IP Changes ---
    // Rule: If login from > 3 distinct IPs in last 1 minute, auto-ban.
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentLogins = user.loginHistory.filter(h => h.timestamp > oneMinuteAgo);
    const distinctIps = new Set(recentLogins.map(h => h.ip));
    
    // Add current IP to the set to check
    distinctIps.add(ip);

    if (distinctIps.size > 3) {
      user.isBlacklisted = true;
      await user.save();
      res.status(403).json({ error: '账号异常：短时间内IP变动过于频繁，系统已自动封禁。请联系客服解封。' });
      return;
    }

    // --- Single Session Logic ---
    // Generate a new unique token for this session
    const sessionToken = uuidv4();
    user.currentSessionToken = sessionToken;

    // Update last login time and history
    user.lastLoginAt = new Date();
    user.loginHistory.push({
      ip,
      timestamp: new Date(),
      device
    });
    
    // Limit history size to last 50 entries to save space
    if (user.loginHistory.length > 50) {
      user.loginHistory = user.loginHistory.slice(-50);
    }

    await user.save();
    
    // Return user without password
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    
    // We append the sessionToken to the mock token so middleware can verify it
    // Format: "mock-token-PHONE:SESSION_TOKEN"
    const authToken = `mock-token-${phone}:${sessionToken}`;

    res.json({
      success: true,
      user: userWithoutPassword,
      token: authToken
    });
  } catch (error: any) {
    console.error('Login error:', error);
    // Return detailed error message for debugging
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  const { phone, password, avatar, email, code } = req.body;
  const ip = getClientIp(req);
  const device = req.headers['user-agent'] || 'Unknown Device';
  
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

    // Initial Session Token
    const sessionToken = uuidv4();

    // Register: Create new user
    const user = await User.create({
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5), // Unique ID
      username,
      password, // In production, hash this!
      nickname: `用户${phone.slice(-4)}`,
      phone,
      email: email || undefined,
      isVip: false,
      avatar: avatar || '',
      currentSessionToken: sessionToken,
      lastLoginAt: new Date(),
      loginHistory: [{
        ip,
        timestamp: new Date(),
        device
      }]
    });
    
    // Return user without password
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    
    const authToken = `mock-token-${phone}:${sessionToken}`;

    res.json({
      success: true,
      user: userWithoutPassword,
      token: authToken
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

  // Token format: "mock-token-PHONE:SESSION_TOKEN"
  const token = authHeader.split(' ')[1];
  const tokenParts = token.replace('mock-token-', '').split(':');
  const phone = tokenParts[0];
  const sessionToken = tokenParts[1]; // Might be undefined for old clients

  try {
    await connectDB();
    const user = await User.findOne({ phone });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // --- Single Session Check ---
    // If user has a currentSessionToken set in DB, but the request token doesn't match
    // it means this device is using an old or invalid token.
    if (user.currentSessionToken && sessionToken !== user.currentSessionToken) {
      // Allow old tokens momentarily if sessionToken is undefined (migration) 
      // OR strictly enforce:
      if (sessionToken) {
        res.status(401).json({ error: '您的账号已在其他设备登录，当前会话已失效。' });
        return;
      }
      // If sessionToken is missing (old client), we might optionally allow it or force logout.
      // For security, let's force logout if DB has a token.
      if (user.currentSessionToken) {
         res.status(401).json({ error: '您的账号已在其他设备登录，当前会话已失效。' });
         return;
      }
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
  const tokenParts = token.replace('mock-token-', '').split(':');
  const phone = tokenParts[0];
  const sessionToken = tokenParts[1];
  const { petType, petName } = req.body;

  try {
    await connectDB();
    const user = await User.findOne({ phone });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Session Check
    if (user.currentSessionToken && sessionToken !== user.currentSessionToken) {
       if (sessionToken || user.currentSessionToken) {
          res.status(401).json({ error: 'Session expired' });
          return;
       }
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
