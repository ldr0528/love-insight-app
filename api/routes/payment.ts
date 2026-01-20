
import { Router, type Request, type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { createNativeOrder } from '../services/wechat.js'

const router = Router()

// In-memory store for orders (In production, use a database)
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
    const { method = 'wechat' } = req.body
    const orderId = uuidv4().replace(/-/g, '') // WeChat Pay prefers no dashes usually, but V3 handles strings. Let's clean it up.
    
    // Save order locally first
    orders[orderId] = {
      id: orderId,
      amount: 9.90,
      status: 'pending',
      method,
      createdAt: Date.now()
    }

    let payUrl = ''

    if (method === 'wechat') {
      try {
        // Try Real WeChat Pay
        const protocol = req.protocol
        const host = req.get('host')
        const notifyUrl = `${protocol}://${host}/api/payment/notify/wechat`

        payUrl = await createNativeOrder({
          description: 'Love Insight Report',
          out_trade_no: orderId,
          notify_url: notifyUrl,
          amount: {
            total: 990, // 9.90 CNY in cents
            currency: 'CNY'
          }
        })
      } catch (e: any) {
        console.warn('WeChat Pay Real Mode failed (falling back to Mock):', e.message)
        // Fallback to Mock Gateway
        const protocol = req.protocol
        const host = req.get('host')
        payUrl = `${protocol}://${host}/api/payment/gateway?orderId=${orderId}`
      }
    } else {
      // Mock Alipay (similar logic could apply if we had Alipay SDK)
      const protocol = req.protocol
      const host = req.get('host')
      payUrl = `${protocol}://${host}/api/payment/gateway?orderId=${orderId}`
    }

    res.json({
      success: true,
      orderId,
      payUrl, // QR Code content
      amount: 9.90
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Order creation failed' })
  }
})

/**
 * 2. Check Order Status (Polling)
 * GET /api/payment/status/:orderId
 */
router.get('/status/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params
  const order = orders[orderId]

  if (!order) {
     res.status(404).json({ success: false, error: 'Order not found' })
     return
  }

  // In a real system, if status is pending, we might want to actively query WeChat Pay API to sync status
  // But usually, we rely on the Notify Callback.
  
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
  // In V3, you need to verify signature and decrypt ciphertext.
  // For simplicity in this demo structure, we assume if we receive a valid format, we update.
  // BUT: Real implementation MUST use wxPay.verifyAndDecrypt()
  
  // Note: wechatpay-node-v3 middleware can handle this automatically if configured.
  // Here we just mock the update for demonstration of the route existence.
  
  try {
    const { resource } = req.body
    if (resource && resource.ciphertext) {
       // Decrypt logic here...
       // const plaintext = ...
       // const { out_trade_no } = JSON.parse(plaintext)
       
       // Mocking the extraction:
       // const order = orders[out_trade_no]
       // if (order) order.status = 'paid'
    }
    
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

/**
 * 4. Mock Gateway Page (UI for "Paying")
 * GET /api/payment/gateway
 */
router.get('/gateway', (req: Request, res: Response) => {
  const { orderId } = req.query
  const order = orders[orderId as string]

  if (!order) {
    res.send('<h1>Order not found</h1>')
    return
  }

  if (order.status === 'paid') {
    res.send('<h1>Already Paid</h1><script>window.close()</script>')
    return
  }

  // Simple HTML to simulate a payment provider page
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Secure Payment Gateway</title>
      <style>
        body { font-family: -apple-system, sans-serif; display: flex; flex-col; items-center; justify-center; height: 100vh; margin: 0; background: #f5f5f5; }
        .card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; max-width: 90%; width: 320px; }
        .amount { font-size: 2.5rem; font-weight: bold; margin: 1rem 0; color: #333; }
        .btn { background: ${order.method === 'wechat' ? '#07c160' : '#1677ff'}; color: white; border: none; padding: 1rem; width: 100%; border-radius: 0.5rem; font-size: 1.1rem; font-weight: bold; cursor: pointer; }
        .btn:active { opacity: 0.9; }
        .logo { font-size: 3rem; margin-bottom: 0.5rem; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">${order.method === 'wechat' ? '💬' : '💎'}</div>
        <h2>${order.method === 'wechat' ? '微信支付 (Mock)' : '支付宝 (Mock)'}</h2>
        <div class="amount">¥ ${order.amount.toFixed(2)}</div>
        <p>Order: ${order.id.slice(0, 8)}...</p>
        <button class="btn" onclick="confirmPay()">立即支付</button>
      </div>
      <script>
        function confirmPay() {
          const btn = document.querySelector('.btn');
          btn.innerText = '支付中...';
          btn.disabled = true;
          
          fetch('/api/payment/confirm', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ orderId: '${order.id}' })
          }).then(res => res.json()).then(data => {
            if(data.success) {
              document.body.innerHTML = '<div style="text-align:center;padding-top:2rem"><h1>✅ 支付成功</h1><p>您可以关闭此页面返回应用</p></div>';
            }
          });
        }
      </script>
    </body>
    </html>
  `
  res.send(html)
})

/**
 * 5. Confirm Payment (Called by Mock Gateway)
 * POST /api/payment/confirm
 */
router.post('/confirm', (req: Request, res: Response) => {
  const { orderId } = req.body
  const order = orders[orderId]

  if (order) {
    order.status = 'paid'
    console.log(`Order ${orderId} marked as paid`)
    res.json({ success: true })
  } else {
    res.status(404).json({ success: false })
  }
})

export default router
