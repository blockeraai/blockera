/**
 * Blockera dependencies
 */
import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Min Height → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('simple value - should update min-height when adding value', () => {
		// activate min height
		cy.activateMoreSettingsItem('More Size Settings', 'Min Height');

		cy.getParentContainer('Min').within(() => {
			cy.get('input').type(10);
		});

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'min-height', '10px');

		//Check store
		getWPDataObject().then((data) => {
			expect('10px').to.be.equal(
				getSelectedBlock(data, 'blockeraMinHeight')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'min-height', '10px');
	});

	it('variable value', () => {
		// activate min height
		cy.activateMoreSettingsItem('More Size Settings', 'Min Height');

		// open value addon
		cy.getParentContainer('Min').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('contentSize');

		// Check block
		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should(
					'include',
					'min-height: var(--wp--style--global--content-size)'
				);
		});

		// Check store
		getWPDataObject().then((data) => {
			expect({
				settings: {
					name: 'Content Width',
					id: 'contentSize',
					value: '620px',
					reference: {
						type: 'preset',
					},
					type: 'width-size',
					var: '--wp--style--global--content-size',
				},
				name: 'Content Width',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraMinHeight'));
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css-inline-css')
			.invoke('text')
			.should(
				'include',
				'min-height: var(--wp--style--global--content-size)'
			);
	});
});
