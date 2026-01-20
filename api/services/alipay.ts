
import { AlipaySdk } from 'alipay-sdk';
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

  // alipay-sdk 4.x: exec method is for calling OpenAPI
  // For generating payment page URL or Form, we should use `pageExec`
  // pageExec returns string (URL or Form HTML)
  const result = sdk.pageExec(method, {
    bizContent: {
      out_trade_no: order.outTradeNo,
      total_amount: order.totalAmount,
      subject: order.subject,
      product_code: productCode,
    },
    returnUrl: order.returnUrl,
    notifyUrl: order.notifyUrl,
  });

  return result; 
}
