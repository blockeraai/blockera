import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Compatibility with Blocksy Theme', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('Color variables', () => {
		cy.getParentContainer('Text Color').within(() => {
			cy.openValueAddon();
		});

		cy.get('.blockera-component-popover')
			.last()
			.within(() => {
				cy.contains('Blocksy Colors').should('exist');

				cy.contains('Blocksy Color Palette').should('exist');
			});

		// select variable
		cy.selectValueAddonItem('link-initial-color');

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', 'color: var(--theme-link-initial-color)');
		});

		//Check store
		getWPDataObject().then((data) => {
			expect({
				settings: {
					name: 'Link',
					id: 'link-initial-color',
					value: 'var(--theme-palette-color-1)',
					type: 'color',
					group: 'blocksy-colors',
					var: '--theme-link-initial-color',
					label: 'Link',
					reference: {
						type: 'theme',
						theme: 'blocksy',
					},
				},
				name: 'Link',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFontColor'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', 'color: var(--theme-link-initial-color)');
	});

	it('Width Size variables', () => {
		cy.getParentContainer('Width').within(() => {
			cy.openValueAddon();
		});

		cy.get('.blockera-component-popover')
			.last()
			.within(() => {
				cy.contains('Blocksy Width Size').should('exist');
			});

		// select variable
		cy.selectValueAddonItem('normal-container-max-width');

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should(
					'include',
					'width: var(--theme-normal-container-max-width)'
				);
		});

		//Check store
		getWPDataObject().then((data) => {
			expect({
				settings: {
					name: 'Normal Container Max Width',
					id: 'normal-container-max-width',
					value: '1290px',
					type: 'width-size',
					group: 'blocksy-width-size',
					var: '--theme-normal-container-max-width',
					label: 'Normal Container Max Width',
					reference: {
						type: 'theme',
						theme: 'blocksy',
					},
				},
				name: 'Normal Container Max Width',
				isValueAddon: true,
				valueType: 'variable',
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should(
					'include',
					'width: var(--theme-normal-container-max-width)'
				);
		});
	});
});
