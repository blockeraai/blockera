import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Font Size → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
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

		cy.get('.blockera-block').should('have.css', 'font-size', '10px');
	});

	it('Variable value', () => {
		cy.getParentContainer('Font Size').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('small');

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should(
					'include',
					'font-size: var(--wp--preset--font-size--small)'
				);
		});

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

		cy.get('style#blockera-inline-css-inline-css')
			.invoke('text')
			.should(
				'include',
				'font-size: var(--wp--preset--font-size--small)'
			);
	});
});
