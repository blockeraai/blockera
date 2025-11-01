import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

/**
 * This test is for `gap` type that works for `flex` or `grid`.
 *
 * This behavior can changed by setting supports.blockeraStyleEngine['gap-type']
 * i it was not defined means it's value is `gap`
 *
 * Some blocks like `Group` have different functionality that if display is not `flex` or `grid` then
 * it generates gap for different CSS property. The complete tests for that scenario is on the Group block tests.
 */
describe('Gap → Functionality (Type: gap)', () => {
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
							name: 'X-Small',
							id: '30',
							value: '20px',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--30',
						},
						name: 'X-Small',
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

			cy.get('style#blockera-inline-css')
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
							name: 'X-Small',
							id: '30',
							value: '20px',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--30',
						},
						name: 'X-Small',
						isValueAddon: true,
						valueType: 'variable',
					},
					columns: {
						settings: {
							name: 'X-Small',
							id: '30',
							value: '20px',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--30',
						},
						name: 'X-Small',
						isValueAddon: true,
						valueType: 'variable',
					},
					rows: {
						settings: {
							name: 'X-Small',
							id: '30',
							value: '20px',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--30',
						},
						name: 'X-Small',
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
							name: 'X-Small',
							id: '30',
							value: '20px',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--30',
						},
						name: 'X-Small',
						isValueAddon: true,
						valueType: 'variable',
					},
					columns: {
						settings: {
							name: 'Regular',
							id: '50',
							value: 'clamp(30px, 5vw, 50px)',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--50',
						},
						name: 'Regular',
						isValueAddon: true,
						valueType: 'variable',
					},
					rows: {
						settings: {
							name: 'Small',
							id: '40',
							value: '30px',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--40',
						},
						name: 'Small',
						isValueAddon: true,
						valueType: 'variable',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should('include', 'column-gap: var(--wp--preset--spacing--50)')
				.should('include', 'row-gap: var(--wp--preset--spacing--40)');
		});
	});

	context('Reset Value', () => {
		it('should reset gap correctly (Simple and advanced mode)', () => {
			//
			// 1. Reset simple mode
			//
			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(10);
			});

			cy.resetBlockeraAttribute('Layout', 'Gap', 'reset');

			cy.getBlock('core/paragraph').should('have.css', 'gap', 'normal');

			getWPDataObject().then((data) => {
				expect({
					lock: true,
					gap: '',
					rows: '',
					columns: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//
			// 2. Reset advanced mode - Reset from Gap control (parent label)
			//
			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(20);
				cy.getByAriaLabel('Custom Row & Column Gap').click();
			});

			cy.resetBlockeraAttribute('Layout', 'Gap', 'reset');

			cy.getBlock('core/paragraph').should('have.css', 'gap', 'normal');
			cy.getBlock('core/paragraph').should(
				'have.css',
				'column-gap',
				'normal'
			);
			cy.getBlock('core/paragraph').should(
				'have.css',
				'row-gap',
				'normal'
			);

			getWPDataObject().then((data) => {
				expect({
					lock: true,
					gap: '',
					rows: '',
					columns: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//
			// 3. Reset advanced mode - Reset from Rows control (child label)
			//
			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(30);
				cy.getByAriaLabel('Custom Row & Column Gap').click();
			});

			cy.resetBlockeraAttribute('Layout', 'Rows', 'reset');

			cy.getBlock('core/paragraph').should(
				'have.css',
				'gap',
				'normal 30px'
			);
			cy.getBlock('core/paragraph').should(
				'have.css',
				'column-gap',
				'30px'
			);
			cy.getBlock('core/paragraph').should(
				'have.css',
				'row-gap',
				'normal'
			);

			getWPDataObject().then((data) => {
				expect({
					lock: true,
					gap: '30px',
					rows: '',
					columns: '30px',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//
			// 4. Reset advanced mode - Reset from Columns control (child label)
			//
			cy.resetBlockeraAttribute('Layout', 'Gap', 'reset');

			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(40);
				cy.getByAriaLabel('Custom Row & Column Gap').click();
			});

			cy.resetBlockeraAttribute('Layout', 'Columns', 'reset');

			cy.getBlock('core/paragraph').should(
				'have.css',
				'column-gap',
				'normal'
			);
			cy.getBlock('core/paragraph').should('have.css', 'row-gap', '40px');

			getWPDataObject().then((data) => {
				expect({
					lock: true,
					gap: '40px',
					rows: '40px',
					columns: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//
			// 5. Reset advanced mode - Reset from both Columns and Rows control (child labels)
			//
			cy.resetBlockeraAttribute('Layout', 'Gap', 'reset');

			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(50);
				cy.getByAriaLabel('Custom Row & Column Gap').click();
			});

			cy.resetBlockeraAttribute('Layout', 'Columns', 'reset');
			cy.resetBlockeraAttribute('Layout', 'Rows', 'reset');

			cy.getBlock('core/paragraph').should('have.css', 'gap', 'normal');
			cy.getBlock('core/paragraph').should(
				'have.css',
				'column-gap',
				'normal'
			);
			cy.getBlock('core/paragraph').should(
				'have.css',
				'row-gap',
				'normal'
			);

			getWPDataObject().then((data) => {
				expect({
					lock: true,
					gap: '50px',
					rows: '',
					columns: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});
		});
	});
});
