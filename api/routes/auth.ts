/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express';
import SmsAuthService from '../services/smsAuth';

const router = Router();

// Store bizIds to bind verification session (Optional but recommended)
// In production, use Redis with TTL
const sessionStore = new Map<string, string>();

/**
 * Send Verification Code
 * POST /api/auth/send-code
 */
router.post('/send-code', async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ error: 'Phone number is required' });
    return;
  }

  // Use the new SMS Auth Service (Dypnsapi)
  // This service handles code generation and sending internally
  const bizId = await SmsAuthService.sendVerifyCode(phone);
  
  if (bizId) {
    sessionStore.set(phone, bizId);
    res.json({ success: true, message: 'Verification code sent' });
  } else {
    // If it fails (e.g. invalid keys), it might be handled inside the service logs
    // But we should return an error to client
    res.status(500).json({ error: 'Failed to send SMS code' });
  }
});

/**
 * User Login / Register
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { phone, code } = req.body;
  
  if (!phone || !code) {
    res.status(400).json({ error: 'Phone and code are required' });
    return;
  }

  // Use the new SMS Auth Service to verify the code
  const isValid = await SmsAuthService.checkVerifyCode(phone, code);

  if (!isValid) {
     res.status(400).json({ error: 'Invalid or expired verification code' });
     return;
  }

  // Clear session if needed
  sessionStore.delete(phone);

  // Login Success - Return User Info & Token
  res.json({
    success: true,
    user: {
      id: '1',
      phone,
      nickname: `用户${phone.slice(-4)}`
    },
    token: 'mock-jwt-token'
  });
});

export default router;
