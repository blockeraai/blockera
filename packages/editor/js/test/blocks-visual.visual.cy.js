import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	deSelectBlock,
	setParentBlock,
	addBlockToPost,
	setBoxSpacingSide,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

import { sections } from './blocks-visual-content';

describe('Style Engine and Blocks Visual Test', () => {
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

			// Editor Desktop Snapshot
			cy.getIframeBody()
				.find('.blockera-test-' + section)
				.scrollIntoView()
				.compareSnapshot({
					name: section + '-editor-desktop',
					threshold: 0.02,
				})
				.then(
					() => {},
					(error) => {
						failures.push({
							name: section + '-editor-desktop',
							error: error.message,
						});
					}
				);

			cy.setScreenshotViewport('mobile');

			// Editor Mobile Snapshot
			cy.getIframeBody()
				.find('.blockera-test-' + section)
				.scrollIntoView()
				.compareSnapshot({
					name: section + '-editor-mobile',
					threshold: 0.02,
				})
				.then(
					() => {},
					(error) => {
						failures.push({
							name: section + '-editor-mobile',
							error: error.message,
						});
					}
				);

			cy.prepareEditorForScreenshot(true);

			//Check frontend
			savePage();
			redirectToFrontPage();
			cy.prepareFrontendForScreenshot();

			cy.setScreenshotViewport('desktop');

			// Frontend Desktop Snapshot
			cy.get('.blockera-test-' + section)
				.first()
				.scrollIntoView()
				.compareSnapshot({
					name: section + '-frontend-desktop',
					threshold: 0.02,
				})
				.then(
					() => {},
					(error) => {
						failures.push({
							name: section + '-frontend-desktop',
							error: error.message,
						});
					}
				);

			cy.setScreenshotViewport('mobile');

			// Frontend Mobile Snapshot
			cy.get('.blockera-test-' + section)
				.first()
				.scrollIntoView()
				.compareSnapshot({
					name: section + '-frontend-mobile',
					threshold: 0.02,
				})
				.then(
					() => {},
					(error) => {
						failures.push({
							name: section + '-frontend-mobile',
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
						`${failures.length} snapshot(s) failed:${errorMessage}`
					);
				}
			});
		});
	});
});
