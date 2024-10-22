import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Background Color → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });

		cy.get('[aria-label="Settings"]').eq(1).click({ force: true });

		cy.getByDataTest('style-tab').click();

		// add alias to the feature container
		cy.getParentContainer('BG Color').as('bgColorContainer');
	});

	it('simple value background color', () => {
		// act: clicking on color button
		cy.get('@bgColorContainer').within(() => {
			cy.get('button').as('colorBtn');
			cy.get('@colorBtn').click();
		});

		// act: entering new hexColor
		cy.get('.components-popover').each(() => {
			cy.get('.components-popover input').as('hexColorInput');
			cy.get('@hexColorInput').clear();
			cy.get('@hexColorInput').type('666');
		});

		//assert data
		getWPDataObject().then((data) => {
			expect(
				getSelectedBlock(data, 'blockeraBackgroundColor')
			).to.be.equal('#666666');
		});

		// assert editor
		cy.getBlock('core/paragraph').should(
			'have.css',
			'backgroundColor',
			'rgb(102, 102, 102)'
		);

		//assert frontend
		savePage();
		redirectToFrontPage();
		cy.get('.blockera-block').should(
			'have.css',
			'background-color',
			'rgb(102, 102, 102)'
		);
	});

	it('variable background color', () => {
		// act: clicking on color button
		cy.get('@bgColorContainer').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('accent-4');

		//assert data
		getWPDataObject().then((data) => {
			expect({
				settings: {
					name: 'Accent / Four',
					id: 'accent-4',
					value: '#b1c5a4',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Four',
					},
					type: 'color',
					var: '--wp--preset--color--accent-4',
				},
				name: 'Accent / Four',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraBackgroundColor')
			);
		});

		// Check block style
		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should(
					'include',
					'background-color: var(--wp--preset--color--accent-4)'
				);
		});

		//assert frontend
		savePage();
		redirectToFrontPage();
		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should(
				'include',
				'background-color: var(--wp--preset--color--accent-4)'
			);
	});
});
