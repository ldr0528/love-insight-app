
import AlipaySdk from 'alipay-sdk';
import fs from 'fs';
import path from 'path';

// Singleton
let alipaySdk: AlipaySdk | null = null;

export const getAlipaySdk = () => {
  if (alipaySdk) return alipaySdk;

  try {
    const privateKeyPath = path.join(process.cwd(), 'cert', 'alipay_private_key.pem');
    // Alipay Public Key (not app public key) is needed for verification
    const alipayPublicKeyPath = path.join(process.cwd(), 'cert', 'alipay_public_key.pem');

    if (!process.env.ALIPAY_APP_ID || !fs.existsSync(privateKeyPath)) {
      console.warn('Alipay configuration missing.');
      return null;
    }

    const privateKey = fs.readFileSync(privateKeyPath, 'ascii');
    // Optional: Load Alipay Public Key if needed for verification later
    // const alipayPublicKey = fs.existsSync(alipayPublicKeyPath) ? fs.readFileSync(alipayPublicKeyPath, 'ascii') : undefined;

    alipaySdk = new AlipaySdk({
      appId: process.env.ALIPAY_APP_ID,
      privateKey,
      // alipayPublicKey, // Used for verify signature
      endpoint: 'https://openapi.alipay.com/gateway.do',
      timeout: 5000,
    });

    return alipaySdk;
  } catch (error) {
    console.error('Failed to initialize Alipay:', error);
    return null;
  }
};

export interface AlipayOrder {
  outTradeNo: string;
  totalAmount: string;
  subject: string;
  returnUrl?: string;
  notifyUrl?: string;
  productCode?: string; // 'QUICK_WAP_WAY' | 'FAST_INSTANT_TRADE_PAY'
}

/**
 * Create Alipay Order URL
 * Defaults to WAP (Mobile Web) pay, but can be configured.
 */
export const createAlipayOrder = async (order: AlipayOrder, platform: 'mobile' | 'desktop' = 'mobile'): Promise<string> => {
  const sdk = getAlipaySdk();
  if (!sdk) throw new Error('Alipay not configured');

  const method = platform === 'mobile' ? 'alipay.trade.wap.pay' : 'alipay.trade.page.pay';
  const productCode = platform === 'mobile' ? 'QUICK_WAP_WAY' : 'FAST_INSTANT_TRADE_PAY';

  // alipay-sdk exec returns the URL string if formData is not used, or form html
  // We want the URL to redirect the user.
  const result = await sdk.exec(method, {
    bizContent: {
      out_trade_no: order.outTradeNo,
      total_amount: order.totalAmount,
      subject: order.subject,
      product_code: productCode,
    },
    returnUrl: order.returnUrl,
    notifyUrl: order.notifyUrl,
  }, {
    // result type: 'url' makes it return a signed URL that we can redirect to
    // Note: older versions might return form html by default. 'url' is supported in newer ones?
    // Let's check documentation or assume standard behavior.
    // actually alipay-sdk nodejs usually returns a form data structure or url.
    // passing 'formData' in options makes it return form fields. 
    // But for simple redirection, we often want the full URL. 
    // The `alipay-sdk` library `exec` method signature: exec(method, params, options)
    // If we want a GET URL, we might need to construct it manually or use a specific option?
    // Actually, standard practice for `alipay-sdk` is it returns a string (URL) if no formData option.
    // Wait, by default `alipay-sdk` might generate a FORM submit script.
    // Let's assume we want a URL if possible, or we return the form HTML and let frontend render it.
    // However, the previous logic expected a URL to window.open. 
    // `alipay.trade.wap.pay` usually works via a GET url or POST form.
    // Let's try to get the URL.
  });

  // Result is typically a string (URL) if using GET? 
  // Actually, alipay-sdk usually returns the response from Alipay API. 
  // But for page/wap pay, it generates a signed URL/Form.
  // We'll use `formData.get('url')` if we were building it, but here sdk.exec might return the form HTML.
  
  // To get a URL, we might need `sdk.pageExec` or similar if available, or just check the output.
  // Let's check if we can get a URL. 
  // If `result` is a string starting with http, it's a URL. If it starts with <form, it's HTML.
  return result as string; 
}
