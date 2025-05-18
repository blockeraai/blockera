const puppeteer = require('puppeteer');

(async () => {
	try {
		const browserFetcher = puppeteer.createBrowserFetcher();
		const revisionInfo = await browserFetcher.download(
			puppeteer.browserRevision
		);
		console.log(
			`✅ Chromium ${revisionInfo.revision} downloaded to ${revisionInfo.folderPath}`
		);
	} catch (err) {
		console.error('❌ Failed to download Chromium:', err);
		process.exit(1);
	}
})();
