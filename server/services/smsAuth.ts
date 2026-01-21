import Dypnsapi20170525, * as $Dypnsapi20170525 from '@alicloud/dypnsapi20170525';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';

export default class SmsAuthService {
  static createClient(): Dypnsapi20170525 {
    const config = new $OpenApi.Config({
      accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
      accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
    });
    // Endpoint for Number Certification Service
    config.endpoint = `dypnsapi.aliyuncs.com`;
    return new Dypnsapi20170525(config);
  }

  /**
   * Send SMS Verification Code
   * @param phoneNumber 
   * @returns bizId - Unique identifier for this verification request (needed for check)
   */
  static async sendVerifyCode(phoneNumber: string): Promise<string | null> {
    // DEMO Mode Check
    if (!process.env.ALIBABA_CLOUD_ACCESS_KEY_ID || !process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET) {
      console.warn('⚠️ Alibaba Cloud Auth keys not found. Running in DEMO mode.');
      console.log(`[DEMO] Virtual SMS verification triggered for ${phoneNumber}`);
      return 'demo_biz_id_' + Date.now();
    }

    const client = SmsAuthService.createClient();
    const request = new $Dypnsapi20170525.SendSmsVerifyCodeRequest({
      phoneNumber: phoneNumber,
      // You can customize these in .env if needed, but default values often work for the "SMS Auth" service
      signName: process.env.ALIBABA_CLOUD_SMS_SIGN_NAME || '阿里云短信测试', 
      templateCode: process.env.ALIBABA_CLOUD_SMS_TEMPLATE_CODE || 'SMS_TEST',
    });

    const runtime = new $Util.RuntimeOptions({});
    try {
      // NOTE: For the specific "SMS Authentication" (No-Qual/No-Sign) service, 
      // the API might be slightly different or use specific templates.
      // Standard Dypnsapi SendSmsVerifyCode usually requires a valid SignName/TemplateCode.
      // However, the "SMS Auth" service mentioned by the user claims no sign/template needed.
      // If that service uses a specific method, it's typically this one but with system defaults.
      // If the user hasn't created a signature, this might fail unless the account has the "SMS Auth" service activated.
      
      const resp = await client.sendSmsVerifyCodeWithOptions(request, runtime);
      
      if (resp.body.code === 'OK') {
        console.log(`✅ SMS Auth Code sent to ${phoneNumber}, BizId: ${resp.body.result?.bizId}`);
        return resp.body.result?.bizId || null;
      } else {
        console.error(`❌ SMS Auth Send Failed: ${resp.body.message}`);
        return null;
      }
    } catch (error: any) {
      console.error(`❌ SMS Auth Service Error: ${error.message}`);
      return null;
    }
  }

  /**
   * Check SMS Verification Code
   * @param phoneNumber 
   * @param code 
   * @param bizId The bizId returned from sendVerifyCode (optional depending on API)
   */
  static async checkVerifyCode(phoneNumber: string, code: string): Promise<boolean> {
    if (!process.env.ALIBABA_CLOUD_ACCESS_KEY_ID) {
      return false;
    }

    const client = SmsAuthService.createClient();
    const request = new $Dypnsapi20170525.CheckSmsVerifyCodeRequest({
      phoneNumber: phoneNumber,
      verifyCode: code,
      // bizId: bizId // Optional, usually strictly binds the code to the specific send request
    });

    const runtime = new $Util.RuntimeOptions({});
    try {
      const resp = await client.checkSmsVerifyCodeWithOptions(request, runtime);
      
      if (resp.body.code === 'OK' && resp.body.result?.verifyResult === 'PASS') {
        console.log(`✅ SMS Verification Passed for ${phoneNumber}`);
        return true;
      } else {
        console.warn(`⚠️ SMS Verification Failed: ${resp.body.message}`);
        return false;
      }
    } catch (error: any) {
      console.error(`❌ SMS Auth Check Error: ${error.message}`);
      return false;
    }
  }
}
