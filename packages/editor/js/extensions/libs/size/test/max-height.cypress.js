/**
 * Blockera dependencies
 */
import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Max Height → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is a test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('simple value - should update max-height when adding value', () => {
		// activate max height
		cy.activateMoreSettingsItem('More Size Settings', 'Max Height');

		cy.getParentContainer('Max').within(() => {
			cy.get('input').type(200);
		});

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'max-height', '200px');

		// Check store
		getWPDataObject().then((data) => {
			expect('200px').to.be.equal(
				getSelectedBlock(data, 'blockeraMaxHeight')
			);
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'max-height', '200px');
	});

	it('variable value', () => {
		// activate max height
		cy.activateMoreSettingsItem('More Size Settings', 'Max Height');

		// open value addon
		cy.getParentContainer('Max').within(() => {
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
					'max-height: var(--wp--style--global--content-size)'
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
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraMaxHeight'));
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css-inline-css')
			.invoke('text')
			.should(
				'include',
				'max-height: var(--wp--style--global--content-size)'
			);
	});
});
