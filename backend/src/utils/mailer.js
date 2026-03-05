const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: `"Inkfinity" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Verify your Inkfinity account',
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f4f4f9; margin: 0; padding: 0; }
            .container { max-width: 520px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 36px; text-align: center; }
            .header h1 { color: #fff; font-size: 28px; margin: 0; letter-spacing: -0.5px; }
            .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
            .body { padding: 36px; text-align: center; }
            .body p { color: #555; font-size: 15px; line-height: 1.6; }
            .otp-box { display: inline-block; background: #f0f0ff; border: 2px dashed #6366f1; border-radius: 12px; padding: 20px 40px; margin: 24px 0; }
            .otp-code { font-size: 42px; font-weight: 800; color: #6366f1; letter-spacing: 12px; }
            .expiry { color: #e11d48; font-size: 13px; margin-top: 8px; }
            .footer { background: #f8f8fc; padding: 20px; text-align: center; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✍️ Inkfinity</h1>
              <p>The modern blogging platform</p>
            </div>
            <div class="body">
              <p>Hey there! 👋 You're almost set. Use the code below to verify your email address.</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="expiry">⏱ Expires in <strong>5 minutes</strong></div>
              </div>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Inkfinity. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
