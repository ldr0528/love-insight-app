/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import reportRoutes from './routes/report.js'
import analyzeRoutes from './routes/analyze.js'
import paymentRoutes from './routes/payment.js'
import namingRoutes from './routes/naming.js'
import compatibilityRoutes from './routes/compatibility.js'
import adminRoutes from './routes/admin.js'
import worryRoutes from './routes/worry.js'
import dreamRoutes from './routes/dream.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Behind Vercel/Proxies, trust X-Forwarded-* headers
app.set('trust proxy', true)

/**
 * API Routes
 */
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes)
apiRouter.use('/report', reportRoutes)
apiRouter.use('/analyze', analyzeRoutes)
apiRouter.use('/payment', paymentRoutes)
apiRouter.use('/naming', namingRoutes)
apiRouter.use('/compatibility', compatibilityRoutes)
apiRouter.use('/admin', adminRoutes)
apiRouter.use('/worry', worryRoutes)
apiRouter.use('/dream', dreamRoutes)

/**
 * health
 */
apiRouter.get(
  '/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV
    })
  },
)

// Mount API routes
// Handle both /api prefix (standard) and root (if rewritten by Vercel)
app.use('/api', apiRouter);
app.use('/', apiRouter);

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler (API only)
 */
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

/**
 * Serve static files in production
 */
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist')
  app.use(express.static(distPath))

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  // In development, we might want to just 404 for non-api routes
  // because the frontend is served by Vite on a different port.
  app.use((req: Request, res: Response) => {
     res.status(404).json({
      success: false,
      error: 'Not Found',
    })
  })
}

export default app
