import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_TgRnH1jy_2nKPyX8kbWmLNyCGdUt8tqvb');

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

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields (Name, Email, Message).' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'arunpandi47777@gmail.com',
      replyTo: email,
      subject: subject ? `[Portfolio] ${subject}` : `New message from ${name} on Portfolio`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 12px;">
          <h2 style="color: #2563eb; margin-top: 0;">New Portfolio Contact Message</h2>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
          <div style="margin-top: 16px; padding: 16px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message}</p>
          </div>
          <footer style="margin-top: 20px; font-size: 12px; color: #64748b;">
            Sent automatically from your portfolio contact form (arunpandian.online).
          </footer>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      data,
    });
  } catch (error) {
    console.error('Resend Contact API Error:', error);
    return res.status(500).json({ message: error.message || 'Failed to send message via Resend.' });
  }
}
