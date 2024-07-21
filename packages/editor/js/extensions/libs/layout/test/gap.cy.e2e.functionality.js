import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Gap → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});
	});

	context('Simple Value', () => {
		it('should update gap correctly, when add data', () => {
			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(10);
			});

			cy.getBlock('core/paragraph').should('have.css', 'gap', '10px');

			getWPDataObject().then((data) => {
				expect({
					lock: true,
					gap: '10px',
					rows: '',
					columns: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.blockera-block').should('have.css', 'gap', '10px');
		});

		it('should update row-gap & column-gap correctly, when add data', () => {
			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(8);
				cy.getByAriaLabel('Custom Row & Column Gap').click();
			});

			getWPDataObject().then((data) => {
				expect({
					lock: false,
					gap: '8px',
					rows: '8px',
					columns: '8px',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			cy.getParentContainer('Gap').within(() => {
				cy.getParentContainer('Rows').within(() => {
					cy.get('input').clear();
					cy.get('input').type(10, { force: true });
				});

				cy.getParentContainer('Columns').within(() => {
					cy.get('input').clear();
					cy.get('input').type(15, { force: true });
				});
			});

			cy.getBlock('core/paragraph')
				.should('have.css', 'column-gap', '15px')
				.and('have.css', 'row-gap', '10px');

			getWPDataObject().then((data) => {
				expect({
					lock: false,
					gap: '8px',
					rows: '10px',
					columns: '15px',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.blockera-block')
				.should('have.css', 'column-gap', '15px')
				.and('have.css', 'row-gap', '10px');
		});
	});

	context('Variable Value', () => {
		it('should update gap correctly, when add data', () => {
			cy.getParentContainer('Gap').within(() => {
				cy.openValueAddon();
			});

			cy.selectValueAddonItem('30');

			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should('include', 'gap: var(--wp--preset--spacing--30)');
			});

			getWPDataObject().then((data) => {
				expect({
					lock: true,
					gap: {
						settings: {
							name: '3',
							id: '30',
							value: 'min(2.5rem, 3vw)',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--30',
						},
						name: '3',
						isValueAddon: true,
						valueType: 'variable',
					},
					columns: '',
					rows: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css-inline-css')
				.invoke('text')
				.should('include', 'gap: var(--wp--preset--spacing--30)');
		});

		it('should update row-gap & column-gap correctly, when add data', () => {
			cy.getParentContainer('Gap').within(() => {
				cy.openValueAddon();
			});

			cy.selectValueAddonItem('30');

			cy.getParentContainer('Gap').within(() => {
				cy.getByAriaLabel('Custom Row & Column Gap').click();
			});

			getWPDataObject().then((data) => {
				expect({
					lock: false,
					gap: {
						settings: {
							name: '3',
							id: '30',
							value: 'min(2.5rem, 3vw)',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--30',
						},
						name: '3',
						isValueAddon: true,
						valueType: 'variable',
					},
					columns: {
						settings: {
							name: '3',
							id: '30',
							value: 'min(2.5rem, 3vw)',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--30',
						},
						name: '3',
						isValueAddon: true,
						valueType: 'variable',
					},
					rows: {
						settings: {
							name: '3',
							id: '30',
							value: 'min(2.5rem, 3vw)',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--30',
						},
						name: '3',
						isValueAddon: true,
						valueType: 'variable',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			// change rows
			cy.getParentContainer('Rows').within(() => {
				cy.clickValueAddonButton();
			});
			cy.selectValueAddonItem('40');

			// change columns
			cy.getParentContainer('Columns').within(() => {
				cy.clickValueAddonButton();
			});
			cy.selectValueAddonItem('50');

			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'column-gap: var(--wp--preset--spacing--50)'
					)
					.should(
						'include',
						'row-gap: var(--wp--preset--spacing--40)'
					);
			});

			getWPDataObject().then((data) => {
				expect({
					lock: false,
					gap: {
						settings: {
							name: '3',
							id: '30',
							value: 'min(2.5rem, 3vw)',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--30',
						},
						name: '3',
						isValueAddon: true,
						valueType: 'variable',
					},
					columns: {
						settings: {
							name: '5',
							id: '50',
							value: 'min(6.5rem, 8vw)',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--50',
						},
						name: '5',
						isValueAddon: true,
						valueType: 'variable',
					},
					rows: {
						settings: {
							name: '4',
							id: '40',
							value: 'min(4rem, 5vw)',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--40',
						},
						name: '4',
						isValueAddon: true,
						valueType: 'variable',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css-inline-css')
				.invoke('text')
				.should('include', 'column-gap: var(--wp--preset--spacing--50)')
				.should('include', 'row-gap: var(--wp--preset--spacing--40)');
		});
	});
});
