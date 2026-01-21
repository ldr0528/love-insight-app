
import WxPay from 'wechatpay-node-v3'
import fs from 'fs'
import path from 'path'

// Singleton instance
let wxPay: WxPay | null = null

export const getWxPay = () => {
  if (wxPay) return wxPay

  try {
    // Priority 1: Check Environment Variables for Content
    // This bypasses file system issues entirely on Vercel
    let privateKey: Buffer | undefined;
    let publicKey: Buffer | undefined;
    const serialNo = process.env.WECHAT_SERIAL_NO || ''

    if (process.env.WECHAT_KEY_CONTENT && process.env.WECHAT_CERT_CONTENT) {
       console.log('[WeChat] Using certificates from Environment Variables');
       // Handle newlines if they were escaped
       const keyContent = process.env.WECHAT_KEY_CONTENT.replace(/\\n/g, '\n');
       const certContent = process.env.WECHAT_CERT_CONTENT.replace(/\\n/g, '\n');
       privateKey = Buffer.from(keyContent);
       publicKey = Buffer.from(certContent);
    }

    // Priority 2: Check File System (Fallback)
    if (!privateKey || !publicKey) {
      // Vercel environment: try to find certificates in various locations
      const possibleCertPaths = [
        path.join(process.cwd(), 'cert', 'apiclient_cert.pem'), // Local dev
        path.join(process.cwd(), 'api', 'cert', 'apiclient_cert.pem'), // Vercel function structure
        path.resolve(__dirname, '..', '..', 'cert', 'apiclient_cert.pem'), // Relative to compiled file
        '/var/task/cert/apiclient_cert.pem' // Absolute path in AWS Lambda
      ];

      const possibleKeyPaths = [
        path.join(process.cwd(), 'cert', 'apiclient_key.pem'),
        path.join(process.cwd(), 'api', 'cert', 'apiclient_key.pem'),
        path.resolve(__dirname, '..', '..', 'cert', 'apiclient_key.pem'),
        '/var/task/cert/apiclient_key.pem'
      ];

      let certPath = '';
      let keyPath = '';

      for (const p of possibleCertPaths) {
        if (fs.existsSync(p)) {
          certPath = p;
          break;
        }
      }

      for (const p of possibleKeyPaths) {
        if (fs.existsSync(p)) {
          keyPath = p;
          break;
        }
      }

      console.log('[WeChat] Looking for certs in:', possibleCertPaths);
      console.log('[WeChat] Found Cert:', certPath);
      console.log('[WeChat] Found Key:', keyPath);
      console.log('[WeChat] MCH_ID exists:', !!process.env.WECHAT_MCH_ID);
      console.log('[WeChat] APP_ID exists:', !!process.env.WECHAT_APP_ID);

      if (!certPath || !keyPath || !process.env.WECHAT_MCH_ID) {
        console.error(`Missing certs or MCH_ID. CertFound: ${!!certPath}, KeyFound: ${!!keyPath}, ID: ${!!process.env.WECHAT_MCH_ID}`)
        throw new Error('WeChat Pay certificates or env vars missing.')
      }
      
      privateKey = fs.readFileSync(keyPath)
      publicKey = fs.readFileSync(certPath)
    }

    wxPay = new WxPay({
      appid: process.env.WECHAT_APP_ID || '',
      mchid: process.env.WECHAT_MCH_ID || '',
      publicKey,
      privateKey,
      serial_no: serialNo,
      key: process.env.WECHAT_API_V3_KEY || '',
    })

    return wxPay
  } catch (error: any) {
    console.error('Failed to initialize WeChat Pay:', error.message)
    // Don't swallow the error during debugging, so we can see it in logs
    if (process.env.NODE_ENV === 'development') {
        console.error(error)
    }
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

  try {
    const result = await pay.transactions_native({
      description: order.description,
      out_trade_no: order.out_trade_no,
      notify_url: order.notify_url,
      amount: order.amount,
    })
    // @ts-ignore
    if (result && result.status === 200 && result.code_url) {
      // @ts-ignore
      return result.code_url
    }
    throw new Error(
      typeof result === 'string'
        ? result
        : JSON.stringify(result || { error: 'Unknown error' })
    )
  } catch (e: any) {
    throw new Error(e?.message || 'WeChat Pay create order failed')
  }
}
