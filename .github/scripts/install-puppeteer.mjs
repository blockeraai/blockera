// Puppeteer v20+ only works with ESM for install scripts
import install from 'puppeteer/install.mjs';

(async () => {
	try {
		await install();
		console.log('✅ Chromium downloaded manually');
	} catch (err) {
		console.error('❌ Puppeteer install failed:', err);
		process.exit(1);
	}
})();
