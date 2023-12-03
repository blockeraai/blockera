/**
 * Internal dependencies
 */
import {
	// addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	savePage,
	redirectToFrontPage,
	appendBlocks,
	selectBlock,
} from '../../../../../../cypress/helpers';

describe('Background Extension', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});

	describe('Extension Initializing', () => {});

	describe('Spacing', () => {
		describe('WordPress Compatibility', () => {
			describe('General', () => {
				// 1- previous WordPress values
				// 2- sync extension value with WordPress value
			});

			describe('Group Block', () => {
				// 1- previous WordPress values
				// 2- sync extension value with WordPress value
			});
		});

		describe('Functionality', () => {
			it('should not spacing value', () => {
				const code = `<!-- wp:buttons -->
					<div class="wp-block-buttons"><!-- wp:button -->
					<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">test button</a></div>
					<!-- /wp:button --></div>
					<!-- /wp:buttons -->`;

				// add block
				appendBlocks(code);

				selectBlock('buttons');
				cy.get('button').contains('Style').click();

				// Check state
				getWPDataObject().then((data) => {
					expect({}).to.deep.equal(
						getSelectedBlock(data, 'publisherSpacing')
					);
				});

				// Save to database.
				savePage();

				// Go to front page
				redirectToFrontPage();

				// Assert css property value with expected value in front end!
				// It should render block affected by extension to display with expected settings!
				// cy.contains('test button')
				// 	.then(($el) => {
				// 		return window.getComputedStyle($el[0]);
				// 	})
				// 	.invoke('getPropertyValue', 'background-color')
				// 	.should('eq', '');
			});
			it.only('should add spacing value', () => {
				const code = `<!-- wp:buttons -->
					<div class="wp-block-buttons"><!-- wp:button -->
					<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">test button</a></div>
					<!-- /wp:button --></div>
					<!-- /wp:buttons -->`;

				// add block
				appendBlocks(code);

				selectBlock('buttons');
				cy.get('button').contains('Style').click();
				cy.get('span[aria-label="Top Margin"]').click();
				cy.get('button[aria-label="Set 10px"]').click();
				// Check state
				// getWPDataObject().then((data) => {
				// 	expect({}).to.deep.equal(
				// 		getSelectedBlock(data, 'publisherSpacing')
				// 	);
				// });

				// Save to database.
				// savePage();

				// Go to front page
				// redirectToFrontPage();

				// Assert css property value with expected value in front end!
				// It should render block affected by extension to display with expected settings!
				// cy.contains('test button')
				// 	.then(($el) => {
				// 		return window.getComputedStyle($el[0]);
				// 	})
				// 	.invoke('getPropertyValue', 'background-color')
				// 	.should('eq', '');
			});
		});
	});
});
