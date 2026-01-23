import crypto from 'crypto'

export interface EPayOrder {
  out_trade_no: string
  name: string
  money: string // '1.00'
  type: 'alipay' | 'wxpay' | 'qqpay'
  notify_url: string
  return_url: string
}

const getEnv = (k: string) => process.env[k] || ''

const signParams = (params: Record<string, any>, key: string) => {
  const sorted = Object.keys(params)
    .filter((k) => k !== 'sign' && k !== 'sign_type' && params[k] !== undefined && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&')
  
  const signStr = `${sorted}${key}`
  return crypto.createHash('md5').update(signStr, 'utf8').digest('hex')
}

export const createEPayOrder = async (order: EPayOrder): Promise<string> => {
  const apiUrl = getEnv('EPAY_API_URL')
  const pid = getEnv('EPAY_PID')
  const key = getEnv('EPAY_KEY')

  if (!apiUrl || !pid || !key) {
    throw new Error('EPay env not configured')
  }

  const params: any = {
    pid: parseInt(pid),
    type: order.type,
    out_trade_no: order.out_trade_no,
    notify_url: order.notify_url,
    return_url: order.return_url,
    name: order.name,
    money: order.money,
    sitename: 'LoveInsight',
    sign_type: 'MD5'
  }

  const sign = signParams(params, key)
  params.sign = sign

  // Many EPay providers work by redirecting the user to the submit URL with query params
  // Or if they support JSON API, usually via `?format=json` or similar.
  // Standard EPay submit is a form POST or GET redirect.
  // To make it compatible with our frontend which expects a URL (QR code or Jump URL):
  // We can try adding `format=json` if the provider supports it, or construct the redirect URL.
  
  // Method 1: Return the Redirect URL (simplest, works for all)
  const query = new URLSearchParams(params).toString()
  return `${apiUrl}?${query}`
}

export const verifyEPayNotify = (payload: any): boolean => {
  try {
    const key = getEnv('EPAY_KEY')
    if (!key) return false
    
    const { sign, ...rest } = payload
    if (!sign) return false

    // EPay usually expects us to sign the incoming params (excluding sign) and compare
    const calc = signParams(rest, key)
    return calc === sign
  } catch {
    return false
  }
}
