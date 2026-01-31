import crypto from 'crypto'

export interface EPayOrder {
  out_trade_no: string
  name: string
  money: string // '1.00'
  type: 'alipay' | 'wxpay' | 'qqpay'
  notify_url: string
  return_url: string
  clientip: string
}

const getEnv = (k: string) => process.env[k] || ''

const signParamsMD5 = (params: Record<string, any>, key: string) => {
  const sorted = Object.keys(params)
    .filter((k) => k !== 'sign' && k !== 'sign_type' && params[k] !== undefined && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&')
  
  const signStr = `${sorted}${key}`
  return crypto.createHash('md5').update(signStr, 'utf8').digest('hex')
}

const formatKey = (key: string, type: 'PUBLIC' | 'PRIVATE') => {
  // If already has headers, return as is
  if (key.includes('-----BEGIN')) return key
  // Split into 64 char lines
  const chunks = key.match(/.{1,64}/g) || []
  return `-----BEGIN ${type} KEY-----\n${chunks.join('\n')}\n-----END ${type} KEY-----`
}

const getSignContent = (params: Record<string, any>) => {
  return Object.keys(params)
    .filter((k) => k !== 'sign' && k !== 'sign_type' && params[k] !== undefined && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&')
}

const signParamsRSA = (params: Record<string, any>, privateKeyStr: string) => {
  const signStr = getSignContent(params)
  const privateKey = formatKey(privateKeyStr, 'PRIVATE')
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(signStr)
  return sign.sign(privateKey, 'base64')
}

const verifyParamsRSA = (params: Record<string, any>, sign: string, publicKeyStr: string) => {
  const signStr = getSignContent(params)
  const publicKey = formatKey(publicKeyStr, 'PUBLIC')
  const verify = crypto.createVerify('RSA-SHA256')
  verify.update(signStr)
  return verify.verify(publicKey, sign, 'base64')
}

export const createEPayOrder = async (order: EPayOrder): Promise<string> => {
  const apiUrl = getEnv('EPAY_API_URL')
  const pid = getEnv('EPAY_PID')
  
  // Try RSA keys first
  const privateKey = getEnv('EPAY_MERCHANT_PRIVATE_KEY')
  // Fallback to MD5 key
  const md5Key = getEnv('EPAY_KEY')

  if (!apiUrl || !pid) {
    throw new Error('EPay API URL or PID not configured')
  }

  const params: any = {
    pid: parseInt(pid),
    type: order.type,
    out_trade_no: order.out_trade_no,
    notify_url: order.notify_url,
    return_url: order.return_url,
    name: order.name,
    money: order.money,
    clientip: order.clientip,
    sitename: 'LoveInsight',
    timestamp: Math.floor(Date.now() / 1000).toString()
  }

  if (privateKey) {
    params.sign_type = 'RSA'
    params.sign = signParamsRSA(params, privateKey)
  } else if (md5Key) {
    params.sign_type = 'MD5'
    params.sign = signParamsMD5(params, md5Key)
  } else {
    throw new Error('EPay keys not configured (Require EPAY_MERCHANT_PRIVATE_KEY or EPAY_KEY)')
  }

  // Handle pay16.cn specific API logic if API URL matches
  // Documentation: https://www.pay16.cn/doc/pay_create.html
  // If the API URL ends with a slash (base URL), we append the create endpoint
  let submitUrl = apiUrl
  if (!submitUrl.includes('submit') && !submitUrl.includes('create')) {
      // Ensure trailing slash
      if (!submitUrl.endsWith('/')) submitUrl += '/'
      // Check if we should use API Create (POST) or Page Pay (GET)
      // For simplicity and compatibility with frontend redirect, we can use the submit URL if supported,
      // But pay16.cn doc says `api/pay/create` (POST).
      
      // Let's try to detect if we should use the API mode
      if (params.sign_type === 'RSA') {
         // Assume new SDK mode: Use POST to create order and get pay_url
         const createUrl = `${submitUrl}api/pay/create`
         
         try {
           const formBody = new URLSearchParams(params).toString()
           const resp = await fetch(createUrl, {
             method: 'POST',
             headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
             },
             body: formBody
           })
           
           if (!resp.ok) {
             throw new Error(`Payment API error: ${resp.statusText}`)
           }
           
           const result: any = await resp.json()
           if (result.code === 0) {
             // Success
             // pay_info contains the redirect URL or data depending on pay_type
             // If pay_type is jump, pay_info is the url
             // If pay_type is qrcode, pay_info is the url
             if (result.pay_info) {
               // If pay_info is a JSON string (e.g. for jsapi), we might need to handle it differently
               // But for 'jump' or 'qrcode', it's usually a URL.
               // Check if it looks like a URL
               if (typeof result.pay_info === 'string' && (result.pay_info.startsWith('http') || result.pay_info.startsWith('weixin:') || result.pay_info.startsWith('alipay:'))) {
                 return result.pay_info
               }
               // If it's a JSON object string, we might need to return the whole result?
               // For now, let's assume it's a URL as we requested 'jump' or 'qrcode' implicitly
               return result.pay_info
             }
           } else {
             throw new Error(result.msg || 'Payment creation failed')
           }
         } catch (e) {
           console.error('EPay API Create Error:', e)
           // Fallback to legacy GET redirect if API fails? 
           // Or just throw.
           throw e
         }
      }
      
      // Legacy or default fallback: append submit.php or api/pay/submit
      // SDK says: api/pay/submit
      submitUrl = `${submitUrl}api/pay/submit`
  }

  // Legacy Method: Return the Redirect URL
  const query = new URLSearchParams(params).toString()
  return `${submitUrl}?${query}`
}

export const verifyEPayNotify = (payload: any): boolean => {
  try {
    const { sign, sign_type, ...rest } = payload
    if (!sign) return false

    // Check sign type or try both if not present (though usually present)
    const type = sign_type || (getEnv('EPAY_MERCHANT_PRIVATE_KEY') ? 'RSA' : 'MD5')

    if (type === 'RSA') {
      const publicKey = getEnv('EPAY_PLATFORM_PUBLIC_KEY')
      if (!publicKey) return false
      return verifyParamsRSA(rest, sign, publicKey)
    } else {
      const key = getEnv('EPAY_KEY')
      if (!key) return false
      const calc = signParamsMD5(rest, key)
      return calc === sign
    }
  } catch (e) {
    console.error('Verify EPay Error:', e)
    return false
  }
}
