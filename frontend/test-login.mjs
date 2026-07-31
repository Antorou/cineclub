import puppeteer from 'puppeteer';
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    // Evaluate before navigation
    await page.evaluateOnNewDocument(() => {
        localStorage.setItem('cineclubUser', 'Antoine');
        localStorage.setItem('cineclubToken', 'fake_jwt_token_123');
    });

    await page.goto('http://localhost:5175');
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
