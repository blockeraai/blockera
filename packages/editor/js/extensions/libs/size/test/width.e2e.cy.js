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

describe('Width → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('simple value - should update width when adding value', () => {
		cy.getParentContainer('Width').within(() => {
			cy.get('input').type(100);
		});

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'width', '100px');

		// Check store
		getWPDataObject().then((data) => {
			expect('100px').to.be.equal(
				getSelectedBlock(data, 'blockeraWidth')
			);
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'width', '100px');
	});

	it('variable value', () => {
		// open value addon
		cy.getParentContainer('Width').within(() => {
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
					'width: var(--wp--style--global--content-size)'
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
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraWidth'));
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css-inline-css')
			.invoke('text')
			.should('include', 'width: var(--wp--style--global--content-size)');
	});
});
