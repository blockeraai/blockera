import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
	appendBlocks,
} from '@blockera/dev-cypress/js/helpers';

describe('Columns Block → Gap → Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	context('Simple Value', () => {
		it('Same row and column values', () => {
			appendBlocks(`<!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"30px","left":"30px"},"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ff8787"}}} -->
<div class="wp-block-columns has-background" style="background-color:#ff8787;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ffb2b2"}}} -->
<div class="wp-block-column has-background" style="background-color:#ffb2b2;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:paragraph {"style":{"color":{"background":"#ffd8d8"}}} -->
<p class="has-background" style="background-color:#ffd8d8">paragraph 1</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ffb2b2"}}} -->
<div class="wp-block-column has-background" style="background-color:#ffb2b2;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:paragraph {"style":{"color":{"background":"#ffd8d8"}}} -->
<p class="has-background" style="background-color:#ffd8d8">paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
					`);

			cy.getBlock('core/paragraph').first().click();

			cy.getByAriaLabel('Select parent block: Column').click();
			cy.getByAriaLabel('Select parent block: Columns').click();

			//
			// Test 1: WP data to Blockera
			//

			getWPDataObject().then((data) => {
				expect({
					top: '30px',
					left: '30px',
				}).to.be.deep.equal(
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
				expect({
					top: '10px',
					left: '10px',
				}).to.be.deep.equal(
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
				expect({
					top: '50px',
					left: '100px',
				}).to.be.deep.equal(
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
			// Unlocked value and clear rows
			//
			cy.getParentContainer('Rows').within(() => {
				cy.get('input').clear();
			});

			getWPDataObject().then((data) => {
				expect({
					top: '',
					left: '100px',
				}).to.be.deep.equal(
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
			// Cleat columns
			//
			cy.getParentContainer('Columns').within(() => {
				cy.get('input').clear();
			});

			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.spacing?.blockGap
				);

				expect({
					lock: false,
					gap: '10px',
					columns: '',
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
				expect({
					top: '30px',
					left: '30px',
				}).to.be.deep.equal(
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

		it('Different row and column values', () => {
			appendBlocks(`<!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"30px","left":"60px"},"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ff8787"}}} -->
<div class="wp-block-columns has-background" style="background-color:#ff8787;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ffb2b2"}}} -->
<div class="wp-block-column has-background" style="background-color:#ffb2b2;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:paragraph {"style":{"color":{"background":"#ffd8d8"}}} -->
<p class="has-background" style="background-color:#ffd8d8">paragraph 1</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ffb2b2"}}} -->
<div class="wp-block-column has-background" style="background-color:#ffb2b2;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:paragraph {"style":{"color":{"background":"#ffd8d8"}}} -->
<p class="has-background" style="background-color:#ffd8d8">paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
					`);

			cy.getBlock('core/paragraph').first().click();

			cy.getByAriaLabel('Select parent block: Column').click();
			cy.getByAriaLabel('Select parent block: Columns').click();

			//
			// Test 1: WP data to Blockera
			//

			getWPDataObject().then((data) => {
				expect({
					top: '30px',
					left: '60px',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.spacing?.blockGap
				);

				expect({
					lock: false,
					gap: '',
					columns: '60px',
					rows: '30px',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//
			// Test 2: Blockera value to WP data
			//

			//
			// Simple locked value
			//
			cy.getParentContainer('Gap').within(() => {
				cy.getByAriaLabel('Custom Row & Column Gap').click();

				cy.get('input').clear();
				cy.get('input').type(10, { force: true });
			});

			getWPDataObject().then((data) => {
				expect({
					top: '10px',
					left: '10px',
				}).to.be.deep.equal(
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
				expect({
					top: '50px',
					left: '100px',
				}).to.be.deep.equal(
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
			// Unlocked value and clear rows
			//
			cy.getParentContainer('Rows').within(() => {
				cy.get('input').clear();
			});

			getWPDataObject().then((data) => {
				expect({
					top: '',
					left: '100px',
				}).to.be.deep.equal(
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
			// Clear columns
			//
			cy.getParentContainer('Columns').within(() => {
				cy.get('input').clear();
			});

			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.spacing?.blockGap
				);

				expect({
					lock: false,
					gap: '10px',
					columns: '',
					rows: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//
			// Enter same value for columns and rows
			//
			cy.getParentContainer('Columns').within(() => {
				cy.get('input').type('10', { force: true });
			});

			cy.getParentContainer('Rows').within(() => {
				cy.get('input').type('10', { force: true });
			});

			getWPDataObject().then((data) => {
				expect({
					top: '10px',
					left: '10px',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.spacing?.blockGap
				);

				expect({
					lock: false,
					gap: '10px',
					columns: '10px',
					rows: '10px',
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
				expect({
					top: '30px',
					left: '30px',
				}).to.be.deep.equal(
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
	});

	context('Variable Value', () => {
		it('Same row and column values', () => {
			appendBlocks(`<!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|20","left":"var:preset|spacing|20"},"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ff8787"}}} -->
<div class="wp-block-columns has-background" style="background-color:#ff8787;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ffb2b2"}}} -->
<div class="wp-block-column has-background" style="background-color:#ffb2b2;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:paragraph {"style":{"color":{"background":"#ffd8d8"}}} -->
<p class="has-background" style="background-color:#ffd8d8">paragraph 1</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ffb2b2"}}} -->
<div class="wp-block-column has-background" style="background-color:#ffb2b2;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:paragraph {"style":{"color":{"background":"#ffd8d8"}}} -->
<p class="has-background" style="background-color:#ffd8d8">paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
					`);

			cy.getBlock('core/paragraph').first().click();

			cy.getByAriaLabel('Select parent block: Column').click();
			cy.getByAriaLabel('Select parent block: Columns').click();

			//
			// Test 1: WP data to Blockera
			//

			getWPDataObject().then((data) => {
				expect({
					top: 'var:preset|spacing|20',
					left: 'var:preset|spacing|20',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.spacing?.blockGap
				);

				expect({
					lock: true,
					gap: {
						settings: {
							name: 'Tiny',
							id: '20',
							value: '10px',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--20',
						},
						name: 'Tiny',
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
			// Simple locked value
			//
			cy.getParentContainer('Gap').within(() => {
				cy.clickValueAddonButton();
			});

			cy.selectValueAddonItem('30');

			getWPDataObject().then((data) => {
				expect({
					top: 'var:preset|spacing|30',
					left: 'var:preset|spacing|30',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.spacing?.blockGap
				);

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
				expect({
					top: 'var:preset|spacing|40',
					left: 'var:preset|spacing|50',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.spacing?.blockGap
				);

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

			//
			// Unlocked value and clear rows
			//
			cy.getParentContainer('Rows').within(() => {
				cy.removeValueAddon();
			});

			getWPDataObject().then((data) => {
				expect({
					top: '',
					left: 'var:preset|spacing|50',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.spacing?.blockGap
				);

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
					rows: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//
			// Cleat columns
			//
			cy.getParentContainer('Columns').within(() => {
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

			//
			// lock again value
			//
			cy.getParentContainer('Gap').within(() => {
				cy.getByAriaLabel('Custom Row & Column Gap').click();

				cy.clickValueAddonButton();
			});

			cy.selectValueAddonItem('20');

			getWPDataObject().then((data) => {
				expect({
					top: 'var:preset|spacing|20',
					left: 'var:preset|spacing|20',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.spacing?.blockGap
				);

				expect({
					lock: true,
					gap: {
						settings: {
							name: 'Tiny',
							id: '20',
							value: '10px',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--20',
						},
						name: 'Tiny',
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

		it('Different row and column values', () => {
			appendBlocks(`<!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|20","left":"var:preset|spacing|30"},"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ff8787"}}} -->
<div class="wp-block-columns has-background" style="background-color:#ff8787;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ffb2b2"}}} -->
<div class="wp-block-column has-background" style="background-color:#ffb2b2;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:paragraph {"style":{"color":{"background":"#ffd8d8"}}} -->
<p class="has-background" style="background-color:#ffd8d8">paragraph 1</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ffb2b2"}}} -->
<div class="wp-block-column has-background" style="background-color:#ffb2b2;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:paragraph {"style":{"color":{"background":"#ffd8d8"}}} -->
<p class="has-background" style="background-color:#ffd8d8">paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
					`);

			cy.getBlock('core/paragraph').first().click();

			cy.getByAriaLabel('Select parent block: Column').click();
			cy.getByAriaLabel('Select parent block: Columns').click();

			//
			// Test 1: WP data to Blockera
			//

			getWPDataObject().then((data) => {
				expect({
					top: 'var:preset|spacing|20',
					left: 'var:preset|spacing|30',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.spacing?.blockGap
				);

				expect({
					lock: false,
					gap: '',
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
							name: 'Tiny',
							id: '20',
							value: '10px',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--20',
						},
						name: 'Tiny',
						isValueAddon: true,
						valueType: 'variable',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
			});

			//
			// Test 2: Blockera value to WP data
			//

			//
			// Set rows value as same as column
			//
			cy.getParentContainer('Rows').within(() => {
				cy.clickValueAddonButton();
			});

			cy.selectValueAddonItem('30');

			getWPDataObject().then((data) => {
				expect({
					top: 'var:preset|spacing|30',
					left: 'var:preset|spacing|30',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.spacing?.blockGap
				);

				expect({
					lock: false,
					gap: '',
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

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.getParentContainer('Gap').within(() => {
				cy.getByAriaLabel('Custom Row & Column Gap').click();

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
