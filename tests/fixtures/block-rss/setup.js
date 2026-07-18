/**
 * block-rss visual setup helpers.
 *
 * core/rss is dynamic (ServerSideRender). Blockera inner-block + block-state
 * styles are applied after the canvas block is selected once SSR items exist.
 */
const { getIframeBody } = require('@blockera/dev-playwright/js/utils/helpers');
const {
	openDocumentSettingsSidebar,
} = require('@blockera/dev-playwright/js/utils/editor');

/**
 * Select the RSS block and wait until inner-block styles are painted.
 *
 * @param {import('@playwright/test').Page} page
 * @return {Promise<void>}
 */
async function editorSetup(page) {
	// Keep Block sidebar open — closing it (viewport helper) can drop canvas styles.
	await openDocumentSettingsSidebar(page, 'Block');

	const iframeBody = getIframeBody(page);
	const rss = iframeBody.locator('.wp-block-rss').first();

	await rss.waitFor({ state: 'visible', timeout: 15000 });
	await iframeBody
		.locator('.wp-block-rss__item')
		.first()
		.waitFor({ state: 'visible', timeout: 15000 });

	await rss.click();
	await page.mouse.move(0, 0);

	const styled = await rss.evaluate(async (el) => {
		const deadline = Date.now() + 15000;

		while (Date.now() < deadline) {
			const title = el.querySelector('.wp-block-rss__item-title');
			if (title) {
				const bg = window.getComputedStyle(title).backgroundColor;
				if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
					return {
						ok: true,
						bg,
						before: window.getComputedStyle(el, '::before').content,
						height: el.getBoundingClientRect().height,
					};
				}
			}

			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		return {
			ok: false,
			bg: null,
			before: window.getComputedStyle(el, '::before').content,
			height: el.getBoundingClientRect().height,
		};
	});

	if (!styled.ok) {
		throw new Error(
			`block-rss editorSetup: styles missing (before=${styled.before}, height=${styled.height})`
		);
	}
}

module.exports = { editorSetup };
