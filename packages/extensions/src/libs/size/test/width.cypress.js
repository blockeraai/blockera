/**
 * Internal dependencies
 */
import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Width → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is a test text.', {
			delay: 0,
		});

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
				getSelectedBlock(data, 'publisherWidth')
			);
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should('have.css', 'width', '100px');
	});

	it('variable value', () => {
		// open value addon
		cy.getParentContainer('Width').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('contentSize');

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'width', '800px');

		// Check store
		getWPDataObject().then((data) => {
			expect({
				settings: {
					name: 'Content Width',
					id: 'contentSize',
					value: '800px',
					reference: {
						type: 'preset',
					},
					type: 'width-size',
					var: '--wp--style--global--content-size',
				},
				name: 'Content Width',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherWidth'));
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should('have.css', 'width', '800px');
		cy.get('.publisher-core-block').hasCssVar(
			'width',
			'--wp--style--global--content-size'
		);
	});
});
