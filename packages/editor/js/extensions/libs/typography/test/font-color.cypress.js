import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Font Color → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('simple value', () => {
		cy.getParentContainer('Text Color').within(() => {
			cy.getByDataCy('color-btn').click();
		});

		cy.getByDataTest('popover-body').within(() => {
			cy.get('input[maxlength="9"]').clear();
			cy.get('input[maxlength="9"]').type('70ca9e');
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'color',
			'rgb(112, 202, 158)'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('#70ca9e').to.be.equal(
				getSelectedBlock(data, 'blockeraFontColor')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'color',
			'rgb(112, 202, 158)'
		);
	});

	it('Variable value', () => {
		cy.getParentContainer('Text Color').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('contrast');

		cy.getBlock('core/paragraph').hasCssVar(
			'color',
			'--wp--preset--color--contrast'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				settings: {
					name: 'Contrast',
					id: 'contrast',
					value: '#111111',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Four',
					},
					type: 'color',
					var: '--wp--preset--color--contrast',
				},
				name: 'Contrast',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFontColor'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').hasCssVar(
			'color',
			'--wp--preset--color--contrast'
		);
	});
});
