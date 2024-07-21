import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
	appendBlocks,
} from '@blockera/dev-cypress/js/helpers';

describe('Gap → Functionality', () => {
	beforeEach(() => {
		createPost();
	});

	context('Group Block', () => {
		context('Group Main Variation (Full & Advanced Tests)', () => {
			it('Simple value', () => {
				appendBlocks(`<!-- wp:group {"style":{"spacing":{"blockGap":"30px"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

				cy.getBlock('core/paragraph').first().click();

				cy.getByAriaLabel('Select Group').click();

				//
				// Test 1: WP data to Blockera
				//

				getWPDataObject().then((data) => {
					expect('30px').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '30px',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Test 2: Blockera value to WP data
				//

				//
				// Simple locked value
				//
				cy.getParentContainer('Gap').within(() => {
					cy.get('input').clear();
					cy.get('input').type(10, { force: true });
				});

				getWPDataObject().then((data) => {
					expect('10px').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '10px',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Unlocked value
				//
				cy.getParentContainer('Gap').within(() => {
					cy.getByAriaLabel('Custom Row & Column Gap').click();
				});

				cy.getParentContainer('Rows').within(() => {
					cy.get('input').clear();
					cy.get('input').type(50, { force: true });
				});

				cy.getParentContainer('Columns').within(() => {
					cy.get('input').clear();
					cy.get('input').type(100, { force: true });
				});

				getWPDataObject().then((data) => {
					expect('50px').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: false,
						gap: '10px',
						columns: '100px',
						rows: '50px',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Unlocked value and empty
				//
				cy.getParentContainer('Rows').within(() => {
					cy.get('input').clear();
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: false,
						gap: '10px',
						columns: '100px',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// lock again value
				//
				cy.getParentContainer('Gap').within(() => {
					cy.getByAriaLabel('Custom Row & Column Gap').click();

					cy.get('input').clear();
					cy.get('input').type(30, { force: true });
				});

				getWPDataObject().then((data) => {
					expect('30px').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '30px',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear
				cy.getParentContainer('Gap').within(() => {
					cy.get('input').clear({ force: true });
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});
			});

			it('Variable value', () => {
				appendBlocks(`<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

				cy.getBlock('core/paragraph').first().click();

				cy.getByAriaLabel('Select Group').click();

				//
				// Test 1: WP data to Blockera
				//

				getWPDataObject().then((data) => {
					expect('var:preset|spacing|20').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: {
							settings: {
								name: '2',
								id: '20',
								value: 'min(1.5rem, 2vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: '2',
							isValueAddon: true,
							valueType: 'variable',
						},
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Test 2: Blockera value to WP data
				//

				//
				// Variable locked value
				//
				cy.getParentContainer('Gap').within(() => {
					cy.clickValueAddonButton();
				});

				cy.selectValueAddonItem('30');

				getWPDataObject().then((data) => {
					expect('var:preset|spacing|30').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

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

				//
				// Unlocked value
				//
				cy.getParentContainer('Gap').within(() => {
					cy.getByAriaLabel('Custom Row & Column Gap').click();
				});

				cy.getParentContainer('Rows').within(() => {
					cy.clickValueAddonButton();
				});

				cy.selectValueAddonItem('40');

				cy.getParentContainer('Columns').within(() => {
					cy.clickValueAddonButton();
				});

				cy.selectValueAddonItem('50');

				getWPDataObject().then((data) => {
					expect('var:preset|spacing|40').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

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

				//
				// Unlocked value and empty
				//
				cy.getParentContainer('Rows').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

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
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// lock again value
				//
				cy.getParentContainer('Gap').within(() => {
					cy.getByAriaLabel('Custom Row & Column Gap').click();
				});

				getWPDataObject().then((data) => {
					expect('var:preset|spacing|30').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

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

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear
				cy.getParentContainer('Gap').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});
			});
		});

		context('Row Variation (Simple Test)', () => {
			it('Simple value', () => {
				appendBlocks(`<!-- wp:group {"style":{"spacing":{"blockGap":"50px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

				cy.getBlock('core/paragraph').first().click();

				cy.getByAriaLabel('Select parent block: Row').click();

				//
				// Test 1: WP data to Blockera
				//

				getWPDataObject().then((data) => {
					expect('50px').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '50px',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Test 2: Blockera value to WP data
				//

				//
				// Simple locked value
				//
				cy.getParentContainer('Gap').within(() => {
					cy.get('input').clear();
					cy.get('input').type(10, { force: true });
				});

				getWPDataObject().then((data) => {
					expect('10px').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '10px',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear
				cy.getParentContainer('Gap').within(() => {
					cy.get('input').clear({ force: true });
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});
			});

			it('Variable value', () => {
				appendBlocks(`<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

				cy.getBlock('core/paragraph').first().click();

				cy.getByAriaLabel('Select parent block: Row').click();

				//
				// Test 1: WP data to Blockera
				//

				getWPDataObject().then((data) => {
					expect('var:preset|spacing|20').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: {
							settings: {
								name: '2',
								id: '20',
								value: 'min(1.5rem, 2vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: '2',
							isValueAddon: true,
							valueType: 'variable',
						},
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Test 2: Blockera value to WP data
				//

				//
				// Variable locked value
				//
				cy.getParentContainer('Gap').within(() => {
					cy.clickValueAddonButton();
				});

				cy.selectValueAddonItem('30');

				getWPDataObject().then((data) => {
					expect('var:preset|spacing|30').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

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

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear
				cy.getParentContainer('Gap').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});
			});
		});

		context('Stack Variation (Simple Test)', () => {
			it('Simple value', () => {
				appendBlocks(`<!-- wp:group {"style":{"spacing":{"blockGap":"50px"}},"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

				cy.getBlock('core/paragraph').first().click();

				cy.getByAriaLabel('Select parent block: Stack').click();

				//
				// Test 1: WP data to Blockera
				//

				getWPDataObject().then((data) => {
					expect('50px').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '50px',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Test 2: Blockera value to WP data
				//

				//
				// Simple locked value
				//
				cy.getParentContainer('Gap').within(() => {
					cy.get('input').clear();
					cy.get('input').type(10, { force: true });
				});

				getWPDataObject().then((data) => {
					expect('10px').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '10px',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear
				cy.getParentContainer('Gap').within(() => {
					cy.get('input').clear({ force: true });
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});
			});

			it('Variable value', () => {
				appendBlocks(`<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

				cy.getBlock('core/paragraph').first().click();

				cy.getByAriaLabel('Select parent block: Stack').click();

				//
				// Test 1: WP data to Blockera
				//

				getWPDataObject().then((data) => {
					expect('var:preset|spacing|20').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: {
							settings: {
								name: '2',
								id: '20',
								value: 'min(1.5rem, 2vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: '2',
							isValueAddon: true,
							valueType: 'variable',
						},
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Test 2: Blockera value to WP data
				//

				//
				// Variable locked value
				//
				cy.getParentContainer('Gap').within(() => {
					cy.clickValueAddonButton();
				});

				cy.selectValueAddonItem('30');

				getWPDataObject().then((data) => {
					expect('var:preset|spacing|30').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

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

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear
				cy.getParentContainer('Gap').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});
			});
		});

		context('Grid Variation (Simple Test)', () => {
			it('Simple value', () => {
				appendBlocks(`<!-- wp:group {"style":{"spacing":{"blockGap":"50px"}},"layout":{"type":"grid"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

				cy.getBlock('core/paragraph').first().click();

				cy.getByAriaLabel('Select parent block: Grid').click();

				//
				// Test 1: WP data to Blockera
				//

				getWPDataObject().then((data) => {
					expect('50px').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '50px',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Test 2: Blockera value to WP data
				//

				//
				// Simple locked value
				//
				cy.getParentContainer('Gap').within(() => {
					cy.get('input').clear();
					cy.get('input').type(10, { force: true });
				});

				getWPDataObject().then((data) => {
					expect('10px').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '10px',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear
				cy.getParentContainer('Gap').within(() => {
					cy.get('input').clear({ force: true });
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});
			});

			it('Variable value', () => {
				appendBlocks(`<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"grid"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

				cy.getBlock('core/paragraph').first().click();

				cy.getByAriaLabel('Select parent block: Grid').click();

				//
				// Test 1: WP data to Blockera
				//

				getWPDataObject().then((data) => {
					expect('var:preset|spacing|20').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: {
							settings: {
								name: '2',
								id: '20',
								value: 'min(1.5rem, 2vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: '2',
							isValueAddon: true,
							valueType: 'variable',
						},
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});

				//
				// Test 2: Blockera value to WP data
				//

				//
				// Variable locked value
				//
				cy.getParentContainer('Gap').within(() => {
					cy.clickValueAddonButton();
				});

				cy.selectValueAddonItem('30');

				getWPDataObject().then((data) => {
					expect('var:preset|spacing|30').to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

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

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear
				cy.getParentContainer('Gap').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.spacing?.blockGap
					);

					expect({
						lock: true,
						gap: '',
						columns: '',
						rows: '',
					}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
				});
			});
		});
	});
});
