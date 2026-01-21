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

const signParams = (params: Record<string, any>, secret: string) => {
  const sorted = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&')
  const base = `${sorted}&key=${secret}`
  return crypto.createHash('md5').update(base, 'utf8').digest('hex').toUpperCase()
}

export const createZPayOrder = async (order: ZPayOrder): Promise<string> => {
  const api = getEnv('ZPAY_API_URL')
  const appId = getEnv('ZPAY_APP_ID')
  const mchId = getEnv('ZPAY_MCH_ID')
  const secret = getEnv('ZPAY_SECRET')
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
  const sign = signParams(payload, secret)
  const body = { ...payload, sign }

  const res = await fetch(`${api}/unified/native`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 200 && data && (data.code_url || data.qr_url)) {
    return (data.code_url || data.qr_url) as string
  }
  throw new Error(typeof data === 'string' ? data : JSON.stringify(data || { error: 'Unknown error' }))
}

export const verifyZPayNotify = (payload: any): boolean => {
  try {
    const secret = getEnv('ZPAY_SECRET')
    const { sign, ...rest } = payload || {}
    if (!sign || !secret) return false
    const calc = signParams(rest, secret)
    return calc === sign
  } catch {
    return false
  }
}
