import crypto from 'crypto'

export interface ZPayOrder {
  description: string
  out_trade_no: string
  notify_url: string
  amount: {
    total: number
    currency: string
  }
}

const getEnv = (k: string) => process.env[k] || ''

type SignAlgo = 'md5' | 'hmac_sha256' | 'none'

const signParams = (params: Record<string, any>, secret: string, algo: SignAlgo) => {
  const sorted = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&')
  if (algo === 'none') return ''
  const base = `${sorted}&key=${secret}`
  if (algo === 'hmac_sha256') {
    return crypto.createHmac('sha256', secret).update(base, 'utf8').digest('hex').toUpperCase()
  }
  return crypto.createHash('md5').update(base, 'utf8').digest('hex').toUpperCase()
}

export const createZPayOrder = async (order: ZPayOrder): Promise<string> => {
  const api = getEnv('ZPAY_API_URL')
  const appId = getEnv('ZPAY_APP_ID')
  const mchId = getEnv('ZPAY_MCH_ID')
  const secret = getEnv('ZPAY_SECRET')
  const path = getEnv('ZPAY_NATIVE_PATH') || '/unified/native'
  const algo = (getEnv('ZPAY_SIGN_ALGO')?.toLowerCase() as SignAlgo) || 'md5'
  if (!api || !appId || !mchId || !secret) {
    throw new Error('ZPAY env not configured')
  }

  const payload = {
    app_id: appId,
    mch_id: mchId,
    out_trade_no: order.out_trade_no,
    description: order.description,
    total: order.amount.total,
    currency: order.amount.currency || 'CNY',
    notify_url: order.notify_url,
    timestamp: Math.floor(Date.now() / 1000),
  }
  const sign = signParams(payload, secret, algo)
  const body = algo === 'none' ? payload : { ...payload, sign }

  const res = await fetch(`${api}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 200 && data) {
    const url = data.code_url || data.qr_url || data.qrcode || data.pay_url || data.url
    if (url) return url as string
  }
  throw new Error(typeof data === 'string' ? data : JSON.stringify(data || { error: 'Unknown error' }))
}

export const verifyZPayNotify = (payload: any): boolean => {
  try {
    const secret = getEnv('ZPAY_SECRET')
    const algo = (getEnv('ZPAY_SIGN_ALGO')?.toLowerCase() as SignAlgo) || 'md5'
    const { sign, ...rest } = payload || {}
    if (!sign || !secret) return false
    const calc = signParams(rest, secret, algo)
    return calc === sign
  } catch {
    return false
  }
}
