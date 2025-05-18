const puppeteer = require('puppeteer');

(async () => {
	try {
		// Force Puppeteer to trigger the install script
		const browserFetcher =
			puppeteer._preferredRevision &&
			puppeteer.util &&
			puppeteer.util.getBrowserFetcher
				? puppeteer.util.getBrowserFetcher()
				: null;

		if (!browserFetcher) {
			console.error(
				'❌ Unable to access Puppeteer browser fetcher in this version.'
			);
			process.exit(1);
		}

		const revision = puppeteer._preferredRevision;
		const revisionInfo = await browserFetcher.download(revision);
		console.log(
			`✅ Chromium ${revision} downloaded to ${revisionInfo.executablePath}`
		);
	} catch (error) {
		console.error('❌ Failed to install Puppeteer Chromium:', error);
		process.exit(1);
	}
})();
