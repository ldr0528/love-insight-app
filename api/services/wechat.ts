
import WxPay from 'wechatpay-node-v3'
import fs from 'fs'
import path from 'path'

// Singleton instance
let wxPay: WxPay | null = null

export const getWxPay = () => {
  if (wxPay) return wxPay

  try {
    // Check if certificates exist
    const certPath = path.join(process.cwd(), 'cert', 'apiclient_cert.pem')
    const keyPath = path.join(process.cwd(), 'cert', 'apiclient_key.pem')

    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath) || !process.env.WECHAT_MCH_ID) {
      console.warn('WeChat Pay certificates or env vars missing. Using Mock Mode.')
      return null
    }

    const privateKey = fs.readFileSync(keyPath)
    const publicKey = fs.readFileSync(certPath)

    wxPay = new WxPay({
      appid: process.env.WECHAT_APP_ID || '',
      mchid: process.env.WECHAT_MCH_ID || '',
      publicKey,
      privateKey,
    })

    return wxPay
  } catch (error) {
    console.error('Failed to initialize WeChat Pay:', error)
    return null
  }
}

export interface WxPayOrder {
  description: string
  out_trade_no: string
  notify_url: string
  amount: {
    total: number
    currency: string
  }
}

/**
 * Create Native Pay Order
 * Returns code_url for QR Code
 */
export const createNativeOrder = async (order: WxPayOrder): Promise<string> => {
  const pay = getWxPay()
  if (!pay) throw new Error('WeChat Pay not configured')

  const result = await pay.transactions_native({
    description: order.description,
    out_trade_no: order.out_trade_no,
    notify_url: order.notify_url,
    amount: order.amount,
  })

  if (result.status === 200 && result.code_url) {
    return result.code_url
  } else {
    throw new Error(`WeChat Pay Error: ${result.message || 'Unknown error'}`)
  }
}
