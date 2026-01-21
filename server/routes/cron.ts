import { Router, type Request, type Response } from 'express';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const router = Router();

router.get('/cleanup', async (req: Request, res: Response) => {
  try {
    // 验证授权头 (简单的密钥保护)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await connectDB();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 查找并删除满足条件的用户：非VIP 且 最后登录时间早于7天前
    // 注意：对于没有 lastLoginAt 字段的旧数据，可以视情况处理，这里假设所有活跃用户都会有 lastLoginAt
    // 或者我们可以把 lastLoginAt 不存在的也视为过期，取决于您的策略
    const result = await User.deleteMany({
      isVip: false,
      $or: [
        { lastLoginAt: { $lt: sevenDaysAgo } },
        // 如果您希望清除那些从未登录过的旧账号（没有lastLoginAt且创建时间超过7天），可以加上这个条件：
        // { lastLoginAt: { $exists: false }, createdAt: { $lt: sevenDaysAgo } }
      ]
    });

    console.log(`Cleanup job ran: Deleted ${result.deletedCount} inactive users.`);

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Successfully deleted ${result.deletedCount} inactive users.`
    });
  } catch (error: any) {
    console.error('Cleanup job error:', error);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

export default router;
