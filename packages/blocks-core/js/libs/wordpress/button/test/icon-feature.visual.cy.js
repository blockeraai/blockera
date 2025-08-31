import {
	appendBlocks,
	savePage,
	createPost,
	getSelectedBlock,
	getWPDataObject,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Button Block → Icon Feature', () => {
	beforeEach(() => {
		createPost();
	});

	it('should be able to add icon to button + visual test', () => {
		appendBlocks(`<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button 1</a></div>
<!-- /wp:button -->

<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button 2</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`);

		//
		// 1. Check editor
		//

		//
		// 1.1. Left icon
		//
		cy.getBlock('core/button').first().click();
		cy.getByDataTest('settings-tab').click();

		cy.getByAriaLabel('Choose Icon…').click();

		cy.get('[data-wp-component="Popover"]')
			.last()
			.within(() => {
				cy.getByAriaLabel('add-card Icon').click();
			});

		//
		// 1.1. Right icon
		//
		cy.getBlock('core/button').eq(1).click();
		cy.getByDataTest('settings-tab').click();

		// set icon
		cy.getByAriaLabel('Choose Icon…').click();
		cy.get('[data-wp-component="Popover"]')
			.last()
			.within(() => {
				cy.getByAriaLabel('add-submenu Icon').click();
			});

		// set end icon
		cy.getByAriaLabel('End').click();

		// set gap
		cy.getParentContainer('Gap').within(() => {
			cy.get('input').type(30, { force: true });
		});

		// set size
		cy.getParentContainer('Size').within(() => {
			cy.get('input').type(30, { force: true });
		});

		// set color
		cy.setColorControlValue('Color', '666666');

		cy.getBlock('core/buttons').first().compareSnapshot({
			name: '1-editor',
			testThreshold: 0.2,
			padding: 20,
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.wp-block-buttons').first().compareSnapshot({
			name: '1-frontend',
			testThreshold: 0.2,
			padding: 20,
		});
	});
});
