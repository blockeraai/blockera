import {
	savePage,
	openSiteEditor,
	assertBlockData,
	closeWelcomeGuide,
	redirectToFrontPage,
	getSelectedBlockStyle,
} from '@blockera/dev-cypress/js/helpers';

describe('Background Color Inside Style Variations → Functionality', () => {
	beforeEach(() => {
		openSiteEditor();

		cy.openGlobalStylesPanel();

		closeWelcomeGuide();

		cy.getByDataTest('block-style-variations').eq(0).click();

		cy.get(`button[id="/blocks/core%2Fparagraph"]`).click();
	});

	it('should be set background color for Default style variation', () => {
		cy.getByDataTest('style-default').click();

		// Uses last Popover + data-cy hex field (avoids multi-match .components-popover input)
		cy.setColorControlValue('BG Color', '666666');

		//assert data
		assertBlockData((data) => {
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
		cy.get('.entry-content p:first-child').should(
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
		assertBlockData((data) => {
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
					'background-color: var(--wp--preset--color--accent-4, #686868) !important;'
				);
		});

		//assert frontend
		savePage();
		redirectToFrontPage();

		cy.get('.entry-content p:first-child').should(
			'have.css',
			'background-color',
			'rgb(104, 104, 104)'
		);
	});
});
