import {
	savePage,
	openSiteEditor,
	getWPDataObject,
	closeWelcomeGuide,
	redirectToFrontPage,
	getSelectedBlockStyle,
} from '@blockera/dev-cypress/js/helpers';

describe('Background Color Inside Style Variations → Functionality', () => {
	beforeEach(() => {
		openSiteEditor();

		cy.openGlobalStylesPanel();

		closeWelcomeGuide();

		cy.getByDataTest('block-style-variations').eq(1).click();

		cy.get(`button[id="/blocks/core%2Fparagraph"]`).click();
	});

	it('should be set background color for Default style variation', () => {
		cy.getByDataTest('style-default').click();

		// add alias to the feature container
		cy.getParentContainer('BG Color').as('bgColorContainer');

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
			console.log(
				getSelectedBlockStyle(data, 'core/paragraph', 'default')
			);
			expect(
				getSelectedBlockStyle(data, 'core/paragraph', 'default')
					?.blockeraBackgroundColor?.value
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

	it('should be set background color with variable for Default style variation', () => {
		cy.getByDataTest('style-default').click();

		// add alias to the feature container
		cy.getParentContainer('BG Color').as('bgColorContainer');

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
					name: 'Accent 4',
					id: 'accent-4',
					value: '#686868',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Five',
					},
					type: 'color',
					var: '--wp--preset--color--accent-4',
				},
				name: 'Accent 4',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(
				getSelectedBlockStyle(data, 'core/paragraph', 'default')
					?.blockeraBackgroundColor?.value
			);
		});

		// Check block style
		cy.getIframeBody().within(() => {
			cy.get('#blockera-global-styles-wrapper')
				.invoke('text')
				.should(
					'include',
					'background-color: var(--wp--preset--color--accent-4)'
				);
		});

		//assert frontend
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'background-color',
			'rgb(104, 104, 104)'
		);
	});
});
