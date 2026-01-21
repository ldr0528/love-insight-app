
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';

export default class SmsService {
  static createClient(): Dysmsapi20170525 {
    // Please ensure that the environment variables ALIBABA_CLOUD_ACCESS_KEY_ID and ALIBABA_CLOUD_ACCESS_KEY_SECRET are set.
    const config = new $OpenApi.Config({
      accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
      accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
    });
    // Endpoint: dysmsapi.aliyuncs.com
    config.endpoint = `dysmsapi.aliyuncs.com`;
    return new Dysmsapi20170525(config);
  }

  static async sendSms(phoneNumber: string, code: string): Promise<boolean> {
    // If no keys are configured, return true in dev mode for testing
    if (!process.env.ALIBABA_CLOUD_ACCESS_KEY_ID || !process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET) {
      console.warn('⚠️ Alibaba Cloud SMS keys not found. Running in DEMO mode.');
      console.log(`[DEMO] SMS sent to ${phoneNumber}: ${code}`);
      return true;
    }

    const client = SmsService.createClient();
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      phoneNumbers: phoneNumber,
      signName: process.env.ALIBABA_CLOUD_SMS_SIGN_NAME || '您的签名', // You need to apply for a signature in Alibaba Cloud console
      templateCode: process.env.ALIBABA_CLOUD_SMS_TEMPLATE_CODE || 'SMS_123456789', // You need to apply for a template
      templateParam: `{"code":"${code}"}`,
    });
    
    const runtime = new $Util.RuntimeOptions({});
    try {
      const resp = await client.sendSmsWithOptions(sendSmsRequest, runtime);
      if (resp.body.code === 'OK') {
        console.log(`✅ SMS sent successfully to ${phoneNumber}`);
        return true;
      } else {
        console.error(`❌ SMS sending failed: ${resp.body.message}`);
        return false;
      }
    } catch (error: any) {
      console.error(`❌ SMS Service Error: ${error.message}`);
      return false;
    }
  }
}
