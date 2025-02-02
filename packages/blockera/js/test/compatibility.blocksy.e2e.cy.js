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
		// savePage();

		// redirectToFrontPage();

		// cy.get('style#blockera-inline-css')
		// 	.invoke('text')
		// 	.should(
		// 		'include',
		// 		'color: var(--theme-link-initial-color)'
		// 	);
	});
});
