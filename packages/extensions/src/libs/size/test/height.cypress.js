/**
 * Internal dependencies
 */
import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Height → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is a test text.', {
			delay: 0,
		});

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
		cy.get('.blockera-core-block').should('have.css', 'height', '80px');
	});

	it('variable value', () => {
		// open value addon
		cy.getParentContainer('Height').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('contentSize');

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'height', '620px');

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

		cy.get('.blockera-core-block').should('have.css', 'height', '620px');
		cy.get('.blockera-core-block').hasCssVar(
			'height',
			'--wp--style--global--content-size'
		);
	});
});

