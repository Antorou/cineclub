import puppeteer from 'puppeteer';
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    // Evaluate before navigation
    await page.evaluateOnNewDocument(() => {
        localStorage.clear();
    });

    await page.goto('http://localhost:5175');
    await new Promise(r => setTimeout(r, 2000));
    const html = await page.content();
    console.log('HTML CONTENT:', html);
    await browser.close();
})();
