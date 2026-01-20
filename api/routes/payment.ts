
import { Router, type Request, type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { createNativeOrder, getWxPay } from '../services/wechat.js'
import { createAlipayOrder, getAlipaySdk } from '../services/alipay.js'

const router = Router()

// In-memory store for orders (Ideally, use a database)
const orders: Record<string, {
  id: string;
  amount: number;
  status: 'pending' | 'paid';
  method: 'wechat' | 'alipay';
  createdAt: number;
}> = {}

/**
 * 1. Create Order
 * POST /api/payment/create
 */
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const { method = 'wechat', platform = 'mobile' } = req.body
    // Alipay supports dashes, but WeChat V3 works better with standard strings.
    // For consistency, let's keep it simple.
    const orderId = uuidv4().replace(/-/g, '') 
    
    // Save order status
    orders[orderId] = {
      id: orderId,
      amount: 16.60,
      status: 'pending',
      method,
      createdAt: Date.now()
    }

    const protocol = req.protocol
    const host = req.get('host')
    let payUrl = ''

    if (method === 'wechat') {
      const notifyUrl = `${protocol}://${host}/api/payment/notify/wechat`
      payUrl = await createNativeOrder({
        description: 'Love Insight Report',
        out_trade_no: orderId,
        notify_url: notifyUrl,
        amount: {
          total: 1660, // 16.60 CNY in cents
          currency: 'CNY'
        }
      })
    } else if (method === 'alipay') {
      const notifyUrl = `${protocol}://${host}/api/payment/notify/alipay`
      const returnUrl = `${protocol}://${host}/report?orderId=${orderId}&status=paid` // Simple return handling
      
      payUrl = await createAlipayOrder({
        outTradeNo: orderId,
        totalAmount: '16.60',
        subject: 'Love Insight Report',
        notifyUrl,
        returnUrl,
      }, platform as 'mobile' | 'desktop')
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
 * 3. WeChat Pay Notify Callback
 * POST /api/payment/notify/wechat
 */
router.post('/notify/wechat', async (req: Request, res: Response) => {
  try {
    const wxPay = getWxPay()
    if (!wxPay) {
      console.error('WeChat Pay not initialized')
      res.status(500).send()
      return
    }

    // Verify Signature & Decrypt
    // wechatpay-node-v3 expects the raw headers and body
    const { ciphertext, associated_data, nonce } = req.body.resource
    const result = wxPay.decipher_gcm(ciphertext, associated_data, nonce, process.env.WECHAT_API_V3_KEY || '')
    
    // @ts-ignore
    if (result && result.out_trade_no) {
       // @ts-ignore
       const orderId = result.out_trade_no
       if (orders[orderId]) {
         orders[orderId].status = 'paid'
         console.log(`[WeChat] Order ${orderId} paid successfully`)
       }
    }

    res.status(200).send()
  } catch (e: any) {
    console.error('WeChat Notify Error:', e)
    res.status(500).send({ code: 'FAIL', message: e.message })
  }
})

/**
 * 4. Alipay Notify Callback
 * POST /api/payment/notify/alipay
 */
router.post('/notify/alipay', async (req: Request, res: Response) => {
  try {
    const sdk = getAlipaySdk()
    if (!sdk) {
      console.error('Alipay not initialized')
      res.status(500).send()
      return
    }

    // Verify signature
    // req.body contains all the POST params from Alipay
    // Note: Express body-parser must be enabled for urlencoded/json
    const params = req.body
    
    // Note: checkNotifySign requires the Alipay Public Key to be configured
    const isValid = await sdk.checkNotifySign(params);
    
    if (isValid) {
      const orderId = params.out_trade_no
      const tradeStatus = params.trade_status
      
      if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
        if (orders[orderId]) {
          orders[orderId].status = 'paid'
          console.log(`[Alipay] Order ${orderId} paid successfully`)
        }
      }
      res.send('success')
    } else {
      console.error('Alipay signature verification failed')
      res.send('fail')
    }
  } catch (e: any) {
    console.error('Alipay Notify Error:', e)
    res.send('fail')
  }
})

export default router
