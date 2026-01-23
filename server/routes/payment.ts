
import { Router, type Request, type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { createEPayOrder, verifyEPayNotify } from '../services/epay.js'

const router = Router()

// In-memory store for orders (Ideally, use a database)
const orders: Record<string, {
  id: string;
  amount: number;
  status: 'pending' | 'paid';
  method: 'epay';
  createdAt: number;
}> = {}

/**
 * 1. Create Order
 * POST /api/payment/create
 */
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const { method = 'epay', platform = 'mobile' } = req.body
    const orderId = uuidv4().replace(/-/g, '') 
    
    // Save order status
    orders[orderId] = {
      id: orderId,
      amount: 16.60,
      status: 'pending',
      method: 'epay',
      createdAt: Date.now()
    }

    const xfProto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0]
    const protocol = xfProto || (req.protocol === 'http' ? 'https' : req.protocol) || 'https'
    const xfHost = (req.headers['x-forwarded-host'] as string)?.split(',')[0]
    const host = xfHost || req.get('host') || process.env.PUBLIC_HOST || ''
    let payUrl = ''

    if (method === 'epay') {
      // Use EPay for generic third-party
      const notifyUrl = `${protocol}://${host}/api/payment/notify/epay`
      const returnUrl = `${protocol}://${host}/report?orderId=${orderId}&status=paid`
      
      payUrl = await createEPayOrder({
        name: 'Love Insight Report',
        out_trade_no: orderId,
        notify_url: notifyUrl,
        return_url: returnUrl,
        money: '16.60',
        type: 'wxpay' // Default to wxpay or pass from frontend
      })
    } else {
      throw new Error('Unsupported payment method')
    }

    res.json({
      success: true,
      orderId,
      payUrl,
      amount: 16.60
    })
  } catch (error: any) {
    console.error('Payment creation error:', error)
    res.status(500).json({ success: false, error: error.message || 'Order creation failed' })
  }
})

/**
 * 2. Check Order Status (Polling)
 * GET /api/payment/status/:orderId
 */
router.get('/status/:orderId', async (req: Request, res: Response) => {
  const { orderId } = req.params
  const order = orders[orderId]

  if (!order) {
     res.status(404).json({ success: false, error: 'Order not found' })
     return
  }
  
  // In a real system, you might want to actively query the payment provider here
  // if the notify callback hasn't arrived yet.
  // For now, we rely on the notify callback updating the in-memory store.

  res.json({
    success: true,
    status: order.status
  })
})

/**
 * 3. EPay Notify Callback
 * POST /api/payment/notify/epay
 */
router.get('/notify/epay', async (req: Request, res: Response) => {
  // EPay often sends notify via GET or POST. We handle GET here for redirects or simple notifys.
  // Actually standard EPay notify is POST. But let's support both just in case.
  handleEPayNotify(req, res)
})

router.post('/notify/epay', async (req: Request, res: Response) => {
  handleEPayNotify(req, res)
})

const handleEPayNotify = async (req: Request, res: Response) => {
  try {
    const params = req.method === 'GET' ? req.query : req.body
    const ok = verifyEPayNotify(params)
    if (!ok) {
      res.send('fail')
      return
    }
    const orderId = params.out_trade_no
    if (orderId && orders[orderId]) {
      orders[orderId].status = 'paid'
      console.log(`[EPay] Order ${orderId} paid successfully`)
    }
    res.send('success')
  } catch (e: any) {
    console.error('EPay Notify Error:', e)
    res.send('fail')
  }
}

/**
 * Manual mark paid
 */
export default router
