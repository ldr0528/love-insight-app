import { Router, type Request, type Response } from 'express';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { code } = req.body;
  
  if (!code || code.length !== 4) {
    res.status(400).json({ error: 'Please provide a 4-digit code' });
    return;
  }

  const username = `Lin${code}`;
  
  res.json({
    success: true,
    user: {
      id: code,
      username,
      nickname: username
    },
    token: 'mock-token-' + code
  });
});

export default router;
