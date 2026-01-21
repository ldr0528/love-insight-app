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
    if (!process.env.ALIBABA_CLOUD_ACCESS_KEY_ID || !process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET) {
      console.error('❌ Alibaba Cloud Auth keys missing.');
      return null;
    }

    const client = SmsAuthService.createClient();
    // Use SendSmsVerifyCodeRequest
    const request = new $Dypnsapi20170525.SendSmsVerifyCodeRequest({
      phoneNumber: phoneNumber,
      signName: process.env.ALIBABA_CLOUD_SMS_SIGN_NAME || '阿里云短信测试', 
      templateCode: process.env.ALIBABA_CLOUD_SMS_TEMPLATE_CODE || 'SMS_TEST',
    });

    const runtime = new $Util.RuntimeOptions({});
    try {
      const resp = await client.sendSmsVerifyCodeWithOptions(request, runtime);
      
      if (resp.body.code === 'OK') {
        console.log(`✅ SMS Auth Code sent to ${phoneNumber}, BizId: ${resp.body.result?.bizId}`);
        return resp.body.result?.bizId || 'success';
      } else {
        console.error(`❌ SMS Auth Send Failed: ${resp.body.message}`);
        // Return null to indicate failure
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
