import {
	savePage,
	createPost,
	appendBlocks,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
const sectionsContext = require.context(
	'../tests/fixtures',
	true,
	/input\.html$/
);

const configContext = require.context(
	'../tests/fixtures',
	true,
	/config\.json$/
);

const sections = sectionsContext
	.keys()
	.map((key) => {
		const matches = key.match(/^\.\/([^/]+)\/input\.html$/);

		if (!matches) {
			return null;
		}

		const sectionId = matches[1];
		const sectionContent = sectionsContext(key);

		if (!sectionContent) {
			return null;
		}

		// Try to load config.json for this section
		let config = null;
		try {
			const configKey = `./${sectionId}/config.json`;
			if (configContext.keys().includes(configKey)) {
				config = configContext(configKey);
			}
		} catch (error) {
			// Config file doesn't exist or can't be loaded
			config = null;
		}

		// Check if screenshot is enabled in config
		// Default to true (test visually) if config doesn't exist
		// Only skip if config exists and screenshot is explicitly false
		const shouldScreenshot = !config || config.screenshot !== false;

		return [sectionId, sectionContent, shouldScreenshot];
	})
	.filter(Boolean)
	.filter(([, , shouldScreenshot]) => shouldScreenshot)
	.reduce((accumulator, [sectionId, sectionContent]) => {
		accumulator[sectionId] = sectionContent;
		return accumulator;
	}, {});

// sections = {
// 	12: sections['12'],
// };

describe('Sections design with Style Engine', () => {
	beforeEach(() => {
		cy.setScreenshotViewport('desktop');

		createPost();
	});

	Object.keys(sections).forEach((section) => {
		it(section, () => {
			const sectionContent = sections[section] || '';
			if (!sectionContent) {
				return;
			}

			// Collect all snapshot failures
			const failures = [];

			appendBlocks(sectionContent);

			cy.prepareEditorForScreenshot();

			// wait to make sure images loaded and content is ready
			cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting

			// Editor Desktop Snapshot
			cy.getIframeBody().find('.is-root-container').scrollIntoView();

			cy.getIframeBody()
				.find('.is-root-container')
				.compareSnapshot({
					name: 'test-' + section + '-editor-desktop',
					threshold: 0.02,
				})
				.then(
					() => {},
					(error) => {
						failures.push({
							name: 'test-' + section + '-editor-desktop',
							error: error.message,
						});
					}
				);

			cy.setScreenshotViewport('mobile');

			// Editor Mobile Snapshot
			cy.getIframeBody().find('.is-root-container').scrollIntoView();

			cy.getIframeBody()
				.find('.is-root-container')
				.compareSnapshot({
					name: 'test-' + section + '-editor-mobile',
					threshold: 0.02,
				})
				.then(
					() => {},
					(error) => {
						failures.push({
							name: 'test-' + section + '-editor-mobile',
							error: error.message,
						});
					}
				);

			cy.prepareEditorForScreenshot(true);

			//Check frontend
			savePage();
			redirectToFrontPage();
			cy.prepareFrontendForScreenshot();

			// wait to make sure images loaded and content is ready
			cy.wait(500); // eslint-disable-line cypress/no-unnecessary-waiting

			cy.setScreenshotViewport('desktop');

			// Frontend Desktop Snapshot
			cy.get('.entry-content').first().scrollIntoView();

			cy.get('.entry-content')
				.first()
				.compareSnapshot({
					name: 'test-' + section + '-frontend-desktop',
					threshold: 0.02,
				})
				.then(
					() => {},
					(error) => {
						failures.push({
							name: 'test-' + section + '-frontend-desktop',
							error: error.message,
						});
					}
				);

			cy.setScreenshotViewport('mobile');

			// Frontend Mobile Snapshot
			cy.get('.entry-content').first().scrollIntoView();

			cy.get('.entry-content')
				.first()
				.compareSnapshot({
					name: 'test-' + section + '-frontend-mobile',
					threshold: 0.02,
				})
				.then(
					() => {},
					(error) => {
						failures.push({
							name: 'test-' + section + '-frontend-mobile',
							error: error.message,
						});
					}
				);

			// After all snapshots, check if any failed and throw combined error
			cy.then(() => {
				if (failures.length > 0) {
					const errorMessage = failures
						.map((f, i) => `\n${i + 1}. ${f.name}:\n   ${f.error}`)
						.join('\n');
					throw new Error(
						`${failures.length} screenshot(s) failed:${errorMessage}`
					);
				}
			});
		});
	});
});
