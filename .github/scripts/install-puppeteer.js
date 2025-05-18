const { install } = require('puppeteer/lib/cjs/puppeteer/install.js');

install()
	.then(() => {
		console.log('✅ Puppeteer Chromium installed successfully');
	})
	.catch((err) => {
		console.error('❌ Puppeteer install failed:', err);
		process.exit(1);
	});
