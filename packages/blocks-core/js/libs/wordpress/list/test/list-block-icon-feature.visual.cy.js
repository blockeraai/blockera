import {
	appendBlocks,
	savePage,
	createPost,
	getSelectedBlock,
	getWPDataObject,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('List Block → Icon Feature', () => {
	beforeEach(() => {
		createPost();
	});

	it('should be able to add icon to button + visual test', () => {
		appendBlocks(`<!-- wp:group {"blockeraPropsId":"0d0c133a-f40f-4846-bfbb-66a99db8888f","blockeraCompatId":"73117745690","blockeraSpacing":{"value":{"padding":{"top":"50px","right":"50px","bottom":"100px","left":"50px"}}},"className":"blockera-block blockera-block\u002d\u002dugv338","style":{"spacing":{"padding":{"top":"50px","right":"50px","bottom":"100px","left":"50px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group blockera-block blockera-block--ugv338" style="padding-top:50px;padding-right:50px;padding-bottom:100px;padding-left:50px"><!-- wp:list -->
<ul><!-- wp:list-item -->
<li>item 1 <a href="#">link is here</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>item 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>item 3</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:group -->`);

		//
		// 1. Check editor
		//

		//
		// 1.1. List icon
		//
		cy.getBlock('core/list').first().click();
		cy.getByAriaLabel('Select List').click();
		cy.getByDataTest('settings-tab').click();

		cy.getByAriaLabel('Choose Icon…').click();

		cy.get('[data-wp-component="Popover"]')
			.last()
			.within(() => {
				cy.getByAriaLabel('add-card Icon').click();
			});

		// set color
		cy.setColorControlValue('Color', '666666');

		//
		// 1.2. List item icon
		//
		cy.getBlock('core/list-item').eq(1).click();
		cy.getByDataTest('settings-tab').click();

		// set icon
		cy.getByAriaLabel('Choose Icon…').click();
		cy.get('[data-wp-component="Popover"]')
			.last()
			.within(() => {
				cy.getByAriaLabel('add-submenu Icon').click();
			});

		// set gap
		cy.getParentContainer('Gap').within(() => {
			cy.get('input').type(30, { force: true });
		});

		// set size
		cy.getParentContainer('Size').within(() => {
			cy.get('input').type(30, { force: true });
		});

		// set color
		cy.setColorControlValue('Color', 'FF6060');

		//
		// 1.3. List item icon
		//
		cy.getBlock('core/list-item').last().click();
		cy.getByDataTest('settings-tab').click();

		// set icon
		cy.getByAriaLabel('Choose Icon…').click();
		cy.get('[data-wp-component="Popover"]')
			.last()
			.within(() => {
				cy.getByAriaLabel('block-meta Icon').click();
			});

		// switch by advanced icon settings button from extension
		cy.getByAriaLabel('Advanced Icon Settings').click();

		cy.get('.blockera-extension-block-card.block-card--inner-block').should(
			'exist'
		);

		cy.getByDataTest('style-tab').click();

		cy.setColorControlValue('BG Color', '0065FE');

		//
		// 1.4. Check visual
		//

		// select group block
		cy.getByAriaLabel('Select List').click();
		cy.getByAriaLabel('Select Group').click();

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
