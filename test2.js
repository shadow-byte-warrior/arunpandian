const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/admin/login');
  await page.type('input[type="email"]', 'arun@gmail.com');
  await page.type('input[type="password"]', 'arun4709s');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.goto('http://localhost:5173/admin/projects');
  await new Promise(r => setTimeout(r, 2000));
  
  try {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes('Add Project')) {
        await btn.click();
        await new Promise(r => setTimeout(r, 1000));
        
        // Type into the modal
        await page.type('input[placeholder="e.g. Data Science Job Market Analysis"]', 'Test Project 123');
        
        // Find Save button and click
        const saveBtns = await page.$$('button[type="submit"]');
        for (const saveBtn of saveBtns) {
          const sText = await page.evaluate(el => el.innerText, saveBtn);
          if (sText.includes('Create Project')) {
            console.log('Clicking Create Project');
            
            // Listen for dialogs (alert)
            page.on('dialog', async dialog => {
              console.log('DIALOG:', dialog.message());
              await dialog.accept();
            });
            
            await saveBtn.click();
            await new Promise(r => setTimeout(r, 2000));
            break;
          }
        }
        break;
      }
    }
  } catch(e) { console.log('Error:', e.message); }
  
  await browser.close();
})();
