const puppeteer = require('puppeteer');

(async () => {
	try {
		const browser = await puppeteer.launch({ headless: 'new' });
		await browser.close();
		console.log('✅ Chromium was downloaded and verified');
	} catch (error) {
		console.error(
			'❌ Failed to download Chromium via puppeteer.launch():',
			error
		);
		process.exit(1);
	}
})();
