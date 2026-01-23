import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'pass',
  },
});

export const sendVerificationEmail = async (email: string, code: string) => {
  // Always log the code in development mode for easier debugging
  console.log('================================================');
  console.log(`[Dev Debug] To: ${email}`);
  console.log(`[Dev Debug] Code: ${code}`);
  console.log('================================================');

  // If SMTP is not configured or uses defaults, skip sending
  if (!process.env.SMTP_HOST || 
      process.env.SMTP_HOST === 'smtp.example.com' || 
      process.env.SMTP_USER?.includes('your_email')) {
    console.log('[Email Service] SMTP not configured, skipping email send.');
    return true;
  }

  try {
    const timestamp = new Date().toLocaleTimeString();
    await transporter.sendMail({
      from: `"灵犀指引" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `【灵犀指引】注册验证码 [${timestamp}]`,
      text: `您的验证码是：${code}。有效期5分钟，请勿泄露给他人。`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
          <h2 style="color: #db2777;">灵犀指引 注册验证</h2>
          <p>亲爱的用户：</p>
          <p>您正在注册灵犀指引账号，您的验证码是：</p>
          <h1 style="color: #4f46e5; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          <p style="color: #666; font-size: 12px;">有效期5分钟，请勿泄露给他人。</p>
          <p style="color: #999; font-size: 10px; margin-top: 20px;">发送时间：${new Date().toLocaleString()}</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

export const sendVIPNotificationEmail = async (email: string) => {
  // If SMTP is not configured or uses defaults, skip sending
  if (!process.env.SMTP_HOST || 
      process.env.SMTP_HOST === 'smtp.example.com' || 
      process.env.SMTP_USER?.includes('your_email')) {
    console.log('[Email Service] SMTP not configured, skipping VIP email send.');
    console.log(`[Dev Debug] VIP Email to: ${email}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"灵犀团队" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '感谢您对灵犀的大力支持！',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; color: #333;">
          <h2 style="color: #db2777;">尊敬的VIP用户：</h2>
          <p>您好！感谢您对灵犀平台的支持与信任，我们非常高兴能够为您提供服务。为了保障您的账户安全，请您妥善保管好自己的账号和密码。</p>
          
          <div style="background-color: #fff1f2; padding: 15px; border-radius: 8px; border-left: 4px solid #e11d48; margin: 20px 0;">
            <p style="margin: 0; color: #be123c; font-weight: bold;">特别提醒：</p>
            <p style="margin: 10px 0 0; font-size: 14px; color: #9f1239;">
              如发现您的账号在多个设备和IP地址上同时登录，系统将自动将该账号列入黑名单。请注意，黑名单内的账号将无法恢复，因此请务必避免此类情况的发生。
            </p>
          </div>
          
          <p>如果您有任何疑问或需要帮助，请随时联系我们的客服团队。</p>
          
          <p style="margin-top: 30px;">
            再次感谢您对灵犀的支持，祝您使用愉快！<br>
            <span style="font-weight: bold; color: #db2777;">灵犀团队</span>
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('VIP Email send error:', error);
    return false;
  }
};
