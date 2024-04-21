import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Font Size → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('Simple value font size', () => {
		cy.getParentContainer('Font Size').within(() => {
			cy.get('input[type="number"]').clear();
			cy.get('input[type="number"]').type(10, {
				force: true,
			});
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'font-size', '10px');

		//Check store
		getWPDataObject().then((data) => {
			expect('10px').to.be.equal(
				getSelectedBlock(data, 'blockeraFontSize')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should('have.css', 'font-size', '10px');
	});

	it('Variable value', () => {
		cy.getParentContainer('Font Size').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('small');

		cy.getBlock('core/paragraph').hasCssVar(
			'font-size',
			'--wp--preset--font-size--small'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				settings: {
					name: 'Small',
					id: 'small',
					value: '0.9rem',
					fluid: null,
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Four',
					},
					type: 'font-size',
					var: '--wp--preset--font-size--small',
				},
				name: 'Small',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFontSize'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').hasCssVar(
			'font-size',
			'--wp--preset--font-size--small'
		);
	});
});
