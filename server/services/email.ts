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
  // If SMTP is not configured, just log it (Dev mode)
  if (!process.env.SMTP_HOST || process.env.SMTP_HOST === 'smtp.example.com') {
    console.log('================================================');
    console.log(`[Mock Email] To: ${email}`);
    console.log(`[Mock Email] Code: ${code}`);
    console.log('================================================');
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"灵犀指引" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '【灵犀指引】注册验证码',
      text: `您的验证码是：${code}。有效期5分钟，请勿泄露给他人。`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
          <h2 style="color: #db2777;">灵犀指引 注册验证</h2>
          <p>亲爱的用户：</p>
          <p>您正在注册灵犀指引账号，您的验证码是：</p>
          <h1 style="color: #4f46e5; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          <p style="color: #666; font-size: 12px;">有效期5分钟，请勿泄露给他人。</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};
