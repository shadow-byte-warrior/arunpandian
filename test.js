const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:5173/admin/login');
  console.log('Got to login');
  
  await page.type('input[type="email"]', 'arun@gmail.com');
  await page.type('input[type="password"]', 'arun4709s');
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Navigated to:', page.url());

  await page.goto('http://localhost:5173/admin/projects');
  console.log('Navigated to projects:', page.url());
  
  try {
    await page.waitForSelector('button', { timeout: 5000 });
    console.log('Found buttons on projects page.');
    
    // click Add Project
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes('Add Project') || text.includes('Add Experience') || text.includes('Add Blog')) {
        console.log('Clicking button:', text);
        await btn.click();
        break;
      }
    }
    
    await new Promise(r => setTimeout(r, 2000));
    
  } catch (e) {
    console.log('Error interacting:', e.message);
  }
  
  await browser.close();
})();
