import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
	appendBlocks,
} from '@blockera/dev-cypress/js/helpers';

describe('Gallery Block → Gap → Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	context('Simple Value', () => {
		it('Same row and column values', () => {
			appendBlocks(`<!-- wp:gallery {"columns":2,"linkTo":"none","style":{"spacing":{"blockGap":{"top":"30px","left":"30px"}}}} -->
<figure class="wp-block-gallery has-nested-images columns-2 is-cropped"><!-- wp:image {"id":57,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-57"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":56,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-56"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":55,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-55"/></figure>
<!-- /wp:image --></figure>
<!-- /wp:gallery -->
					`);

			cy.getBlock('core/image').first().click();

			cy.getByAriaLabel('Select parent block: Gallery').click();

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
			appendBlocks(`<!-- wp:gallery {"columns":2,"linkTo":"none","style":{"spacing":{"blockGap":{"top":"30px","left":"60px"}}}} -->
<figure class="wp-block-gallery has-nested-images columns-2 is-cropped"><!-- wp:image {"id":57,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-57"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":56,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-56"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":55,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-55"/></figure>
<!-- /wp:image --></figure>
<!-- /wp:gallery -->
					`);

			cy.getBlock('core/image').first().click();

			cy.getByAriaLabel('Select parent block: Gallery').click();

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
			appendBlocks(`<!-- wp:gallery {"columns":2,"linkTo":"none","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|20","left":"var:preset|spacing|20"}}}} -->
<figure class="wp-block-gallery has-nested-images columns-2 is-cropped"><!-- wp:image {"id":57,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-57"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":56,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-56"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":55,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-55"/></figure>
<!-- /wp:image --></figure>
<!-- /wp:gallery -->
					`);

			cy.getBlock('core/image').first().click();

			cy.getByAriaLabel('Select parent block: Gallery').click();

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
			// lock again value
			//
			cy.getParentContainer('Gap').within(() => {
				cy.getByAriaLabel('Custom Row & Column Gap').click();

				cy.clickValueAddonButton();
			});

			cy.selectValueAddonItem('10');

			getWPDataObject().then((data) => {
				expect({
					top: 'var:preset|spacing|10',
					left: 'var:preset|spacing|10',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.spacing?.blockGap
				);

				expect({
					lock: true,
					gap: {
						settings: {
							name: '1',
							id: '10',
							value: '1rem',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'spacing',
							var: '--wp--preset--spacing--10',
						},
						name: '1',
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
			appendBlocks(`<!-- wp:gallery {"columns":2,"linkTo":"none","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|20","left":"var:preset|spacing|30"}}}} -->
<figure class="wp-block-gallery has-nested-images columns-2 is-cropped"><!-- wp:image {"id":57,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-57"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":56,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-56"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":55,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-55"/></figure>
<!-- /wp:image --></figure>
<!-- /wp:gallery -->
					`);

			cy.getBlock('core/image').first().click();

			cy.getByAriaLabel('Select parent block: Gallery').click();

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
