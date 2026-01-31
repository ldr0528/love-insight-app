import { type Request, type Response, type NextFunction } from 'express';
import User from '../models/User.js';
import connectDB from '../config/db.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  // Token format: "mock-token-PHONE:SESSION_TOKEN"
  const token = authHeader.split(' ')[1];
  const tokenParts = token.replace('mock-token-', '').split(':');
  
  // Basic validation of token format
  if (tokenParts.length < 1) {
    res.status(401).json({ error: 'Unauthorized: Invalid token format' });
    return;
  }

  const phone = tokenParts[0];
  const sessionToken = tokenParts[1];

  try {
    await connectDB();
    const user = await User.findOne({ phone });
    
    if (!user) {
      res.status(401).json({ error: 'Unauthorized: User not found' });
      return;
    }

    // Single Session Check
    if (user.currentSessionToken && sessionToken !== user.currentSessionToken) {
       // If sessionToken is present but doesn't match, strictly reject
       if (sessionToken) {
          res.status(401).json({ error: 'Session expired: Logged in on another device' });
          return;
       }
       // If sessionToken is missing (legacy), strictly reject if DB enforces it
       if (user.currentSessionToken) {
          res.status(401).json({ error: 'Session expired: Please login again' });
          return;
       }
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};
