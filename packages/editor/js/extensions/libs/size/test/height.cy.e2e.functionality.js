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

describe('Height → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('should update height when adding value', () => {
		cy.getParentContainer('Height').within(() => {
			cy.get('input').type(80);
		});

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'height', '80px');

		// Check store
		getWPDataObject().then((data) => {
			expect('80px').to.be.equal(
				getSelectedBlock(data, 'blockeraHeight')
			);
		});

		//Check frontend
		savePage();
		redirectToFrontPage();
		cy.get('.blockera-block').should('have.css', 'height', '80px');
	});

	it('variable value', () => {
		// open value addon
		cy.getParentContainer('Height').within(() => {
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
					'height: var(--wp--style--global--content-size)'
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
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraHeight'));
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css-inline-css')
			.invoke('text')
			.should(
				'include',
				'height: var(--wp--style--global--content-size)'
			);
	});
});
