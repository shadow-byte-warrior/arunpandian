import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || 're_TgRnH1jy_2nKPyX8kbWmLNyCGdUt8tqvb';
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';
const adminEmail = process.env.ADMIN_EMAIL || 'arunpandi47777@gmail.com';

const resend = new Resend(resendApiKey);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields (Name, Email, Message).' });
  }

  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata',
  });

  try {
    // 1. Send Admin Notification Email (ONLY to ADMIN_EMAIL)
    const adminEmailPromise = resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: email,
      subject: `New Customer Query - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0;">
          <div style="background-color: #2563eb; padding: 16px 20px; border-radius: 8px 8px 0 0; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px;">New Customer Query</h2>
          </div>
          <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
            <p style="margin: 8px 0; font-size: 14px;"><strong>Client Name:</strong> ${name}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Client Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Client Phone:</strong> ${phone || 'Not provided'}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Date & Time:</strong> ${timestamp}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <p style="margin-bottom: 8px; font-size: 14px;"><strong>Full Query / Message:</strong></p>
            <div style="padding: 16px; background-color: #f1f5f9; border-left: 4px solid #2563eb; border-radius: 4px;">
              <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155;">${message}</p>
            </div>
          </div>
          <footer style="margin-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
            Sent automatically to Admin (${adminEmail}) from Portfolio Contact System.
          </footer>
        </div>
      `,
    });

    // 2. Send Confirmation Email (ONLY to client email)
    const clientEmailPromise = resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Thank you for reaching out, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background-color: #ffffff; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0;">
          <h2 style="color: #2563eb; margin-top: 0;">Thank You for Reaching Out!</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #334155;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155;">
            Thank you for contacting me. I have received your message regarding <strong>"${subject || 'your query'}"</strong> and will review it carefully.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155;">
            I usually reply within 24 hours. If your request is urgent, please feel free to reply directly to this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; font-weight: bold; text-transform: uppercase;">Summary of your message:</p>
            <p style="margin: 0; font-size: 14px; color: #475569; white-space: pre-wrap; font-style: italic;">"${message}"</p>
          </div>
          <p style="margin-top: 24px; font-size: 15px; color: #334155; font-weight: bold;">
            Best regards,<br />
            <span style="color: #2563eb;">Arun Pandian</span><br />
            <span style="font-size: 13px; font-weight: normal; color: #64748b;">Data Analyst & Visualizer</span>
          </p>
        </div>
      `,
    });

    const [adminRes, clientRes] = await Promise.all([adminEmailPromise, clientEmailPromise]);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully! Thank you for getting in touch.',
      adminEmailId: adminRes?.data?.id,
      clientEmailId: clientRes?.data?.id,
    });
  } catch (error) {
    console.error('Resend Contact API Error:', error);
    return res.status(500).json({ message: error.message || 'Failed to send email via Resend.' });
  }
}
