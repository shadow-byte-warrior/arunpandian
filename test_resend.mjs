import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY || 're_TgRnH1jy_2nKPyX8kbWmLNyCGdUt8tqvb';
const resend = new Resend(apiKey);

async function runResendTests() {
  console.log('====================================');
  console.log('RESEND API TEST RUNNER');
  console.log('API Key:', apiKey.slice(0, 7) + '...');
  console.log('====================================\n');

  console.log('--- 1. LIST DOMAINS ---');
  try {
    const listRes = await resend.domains.list();
    console.log('Domains List Result:', JSON.stringify(listRes, null, 2));
  } catch (err) {
    console.error('List Domains Error:', err.message);
  }

  console.log('\n--- 2. CREATE DOMAIN (arunpandian.online) ---');
  try {
    const createRes = await resend.domains.create({ name: 'arunpandian.online' });
    console.log('Create Domain Result:', JSON.stringify(createRes, null, 2));
  } catch (err) {
    console.error('Create Domain Error:', err.message);
  }

  console.log('\n--- 3. GET DOMAIN BY ID (9e430b59-50a5-4d88-b8b1-436a2ca047eb) ---');
  try {
    const getRes = await resend.domains.get('9e430b59-50a5-4d88-b8b1-436a2ca047eb');
    console.log('Get Domain Result:', JSON.stringify(getRes, null, 2));
  } catch (err) {
    console.error('Get Domain Error:', err.message);
  }

  console.log('\n--- 4. VERIFY DOMAIN BY ID (9e430b59-50a5-4d88-b8b1-436a2ca047eb) ---');
  try {
    const verifyRes = await resend.domains.verify('9e430b59-50a5-4d88-b8b1-436a2ca047eb');
    console.log('Verify Domain Result:', JSON.stringify(verifyRes, null, 2));
  } catch (err) {
    console.error('Verify Domain Error:', err.message);
  }

  console.log('\n--- 5. SEND TEST EMAIL MESSAGE ---');
  try {
    const emailRes = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'arunpandi47777@gmail.com',
      subject: 'Test Email from Antigravity Resend Integration',
      html: '<strong>Hello Arun Pandian!</strong><p>Your Resend API is fully configured and working with Antigravity.</p>'
    });
    console.log('Send Email Result:', JSON.stringify(emailRes, null, 2));
  } catch (err) {
    console.error('Send Email Error:', err.message);
  }
}

runResendTests();
