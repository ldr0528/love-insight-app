
import { Router, type Request, type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { createEPayOrder, verifyEPayNotify } from '../services/epay.js'

import User from '../models/User.js'
import Order from '../models/Order.js'
import connectDB from '../config/db.js'

const router = Router()

const VIP_PLANS = {
  weekly: { amount: 8.00, name: 'VIP周卡', duration: 7 },
  monthly: { amount: 16.00, name: 'VIP月卡', duration: 30 },
  permanent: { amount: 38.00, name: 'VIP永久', duration: 36500 }
}

/**
 * 1. Create Order
 * POST /api/payment/create
 */
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const { method = 'epay', platform = 'mobile', type = 'report', plan, userId } = req.body
    
    // Validate User ID if provided
    if (userId) {
       await connectDB();
       // Try to find user to ensure it exists
       // (Optional but good practice)
    }

    const orderId = uuidv4().replace(/-/g, '') 
    
    let amount = 16.60
    let productName = 'Love Insight Report'
    let returnUrlPath = '/report'

    if (type === 'vip') {
      if (!plan || !VIP_PLANS[plan as keyof typeof VIP_PLANS]) {
        throw new Error('Invalid VIP plan')
      }
      const planConfig = VIP_PLANS[plan as keyof typeof VIP_PLANS]
      amount = planConfig.amount
      productName = planConfig.name
      returnUrlPath = '/recharge' // Return to recharge page or profile
    }

    // Save order to MongoDB
    await connectDB();
    await Order.create({
      orderId,
      userId: userId || 'anonymous', // Should ideally be required
      amount,
      status: 'pending',
      method: 'epay',
      type,
      plan
    });

    const xfProto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0]
    const protocol = xfProto || (req.protocol === 'http' ? 'https' : req.protocol) || 'https'
    const xfHost = (req.headers['x-forwarded-host'] as string)?.split(',')[0]
    const host = xfHost || req.get('host') || process.env.PUBLIC_HOST || ''
    const clientIp = (req.headers['x-forwarded-for'] as string || '').split(',')[0].trim() || req.ip || '127.0.0.1'
    let payUrl = ''

    if (method === 'epay') {
      // Use EPay for generic third-party
      const notifyUrl = `${protocol}://${host}/api/payment/notify/epay`
      const returnUrl = `${protocol}://${host}${returnUrlPath}?orderId=${orderId}&status=paid`
      
      payUrl = await createEPayOrder({
        name: productName,
        out_trade_no: orderId,
        notify_url: notifyUrl,
        return_url: returnUrl,
        money: amount.toFixed(2),
        type: 'wxpay', // Default to wxpay or pass from frontend
        clientip: clientIp
      })
    } else {
      throw new Error('Unsupported payment method')
    }

    res.json({
      success: true,
      orderId,
      payUrl,
      amount
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
  
  try {
    await connectDB();
    const order = await Order.findOne({ orderId });

    if (!order) {
       res.status(404).json({ success: false, error: 'Order not found' })
       return
    }

    res.json({
      success: true,
      status: order.status
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
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
    await connectDB();
    const order = await Order.findOne({ orderId });

    if (orderId && order) {
      order.status = 'paid';
      await order.save();
      console.log(`[EPay] Order ${orderId} paid successfully`)

      // If it's a VIP order, update user VIP status
      if (order.type === 'vip' && order.userId && order.plan) {
        try {
          // If userId was 'anonymous', we can't update user
          if (order.userId === 'anonymous') {
             console.warn(`[VIP] Cannot update VIP for anonymous order ${orderId}`)
             res.send('success')
             return
          }

          const user = await User.findOne({ id: order.userId }) || await User.findOne({ phone: order.userId })
          
          if (user) {
             // ... same logic as before ...
             const planConfig = VIP_PLANS[order.plan as keyof typeof VIP_PLANS]
             if (!planConfig) {
                console.error(`[VIP] Invalid plan in order: ${order.plan}`)
                res.send('success')
                return
             }

             const now = new Date()
             // If already VIP and not expired, extend
             const currentExpires = user.vipExpiresAt ? new Date(user.vipExpiresAt) : new Date(0)
             let newExpires: Date
             
             if (user.isVip && currentExpires > now) {
               newExpires = new Date(currentExpires.getTime() + planConfig.duration * 24 * 60 * 60 * 1000)
             } else {
               newExpires = new Date(now.getTime() + planConfig.duration * 24 * 60 * 60 * 1000)
             }
             
             user.isVip = true
             user.vipExpiresAt = newExpires
             await user.save()
             console.log(`[VIP] Updated user ${user.phone} VIP to ${newExpires.toISOString()}`)
             
             // Clean up: Delete the completed order immediately as requested
             // We don't need to keep order history
             await Order.deleteOne({ orderId })
             console.log(`[Order] Deleted completed order ${orderId}`)
          } else {
             console.error(`[VIP] User not found for order ${orderId} (userId: ${order.userId})`)
          }
        } catch (dbError) {
          console.error(`[VIP] DB Update Error:`, dbError)
        }
      }
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
