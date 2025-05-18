(async () => {
	try {
		const install = (await import('puppeteer/install.mjs')).default;
		await install();
		console.log(
			'✅ Chromium downloaded manually via puppeteer/install.mjs'
		);
	} catch (err) {
		console.error('❌ Failed to install Chromium:', err);
		process.exit(1);
	}
})();
