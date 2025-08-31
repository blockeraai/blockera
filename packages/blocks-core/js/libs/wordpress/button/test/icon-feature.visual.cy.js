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
		appendBlocks(`<!-- wp:group {"blockeraPropsId":"0d0c133a-f40f-4846-bfbb-66a99db8888f","blockeraCompatId":"73117745690","blockeraSpacing":{"value":{"padding":{"top":"50px","right":"50px","bottom":"100px","left":"50px"}}},"className":"blockera-block blockera-block\u002d\u002dugv338","style":{"spacing":{"padding":{"top":"50px","right":"50px","bottom":"100px","left":"50px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group blockera-block blockera-block--ugv338" style="padding-top:50px;padding-right:50px;padding-bottom:100px;padding-left:50px"><!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button 1</a></div>
<!-- /wp:button -->

<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button 2</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->`);

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

		cy.getBlock('core/group').click();

		cy.getIframeBody()
			.find(`[data-type="core/group"]`)
			.first()
			.compareSnapshot({
				name: '1-editor',
				testThreshold: 0.02,
			});

		//Check frontend
		savePage();

		redirectToFrontPage();

		// disable wp navbar to avoid screenshot issue
		cy.get('#wpadminbar').invoke('css', 'position', 'relative');

		cy.get('.wp-block-group.blockera-block').first().compareSnapshot({
			name: '1-frontend',
			testThreshold: 0.02,
		});
	});
});
