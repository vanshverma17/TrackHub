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
    service: 'gmail', // Use the built-in gmail service to bypass port issues on deployed servers
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    connectionTimeout: 10000, // 10 seconds timeout so it doesn't freeze forever
    greetingTimeout: 10000,
    socketTimeout: 10000
  });

  try {
    await transporter.sendMail({
      from: `"TrackHub" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text
    });
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw new Error("Failed to send verification email. Please try again.");
  }

};
