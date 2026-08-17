// Mock email sender for development purposes.
// In a real application, you would configure nodemailer with SMTP credentials (e.g. SendGrid, AWS SES)
import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text }) => {
  console.log('\n----------------------------------------------------');
  console.log(`📧 MOCK EMAIL SENT TO: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body:\n${text}`);
  console.log('----------------------------------------------------\n');

  // To use real emails, uncomment and configure the following:

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  await transporter.sendMail({
    from: `"TrackHub" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text
  });

};
