/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	assertBlockData,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Height → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('core/image Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:image {"id":60,"height":"500px","sizeSlug":"full","linkDestination":"none"} -->\n' +
					'<figure class="wp-block-image size-full is-resized"><img src="https://placehold.co/600x400" alt="" class="wp-image-60" style="height:500px"/></figure>\n' +
					'<!-- /wp:image -->'
			);

			// Select target block
			cy.getBlock('core/image').click();

			cy.getByAriaControls('styles-view').click();

			// add alias to the feature container
			cy.getParentContainer('Height').as('container');

			cy.addNewTransition();

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			assertBlockData((data) => {
				expect('500px').to.be.equal(
					getSelectedBlock(data, 'blockeraHeight')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').clear();
				cy.get('@containerInput').type('200', { force: true });
			});

			// Blockera value should be moved to WP data
			assertBlockData((data) => {
				expect('200px').to.be.equal(getSelectedBlock(data, 'height'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			assertBlockData((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'height'));
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:image {"id":60,"sizeSlug":"full","linkDestination":"none","className":"is-resized"} -->\n' +
					'<figure class="wp-block-image size-full is-resized"><img src="https://placehold.co/600x400" alt="" class="wp-image-60"/></figure>\n' +
					'<!-- /wp:image -->'
			);

			// Select target block
			cy.getBlock('core/image').click();

			cy.getByAriaControls('styles-view').click();

			// add alias to the feature container
			cy.getParentContainer('Height').as('container');

			//
			// Test 1: Blockera dat to WP
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').type('300', { force: true });
				cy.get('select').select('px');
			});

			// WP data should come to Blockera
			assertBlockData((data) => {
				expect('300px').to.be.equal(
					getSelectedBlock(data, 'blockeraHeight')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			// only px is valid for WP
			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').clear();
				cy.get('@containerInput').type('200', { force: true });
				cy.get('select').select('%');
			});

			// Blockera value should be moved to WP data
			assertBlockData((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'height'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			assertBlockData((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'height'));
			});
		});
	});

	describe('core/post-featured-image Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:post-featured-image {"aspectRatio":"auto","height":"200px"} /-->'
			);

			// Select target block
			cy.getBlock('core/post-featured-image').click();

			// add alias to the feature container
			cy.getParentContainer('Height').as('container');

			cy.addNewTransition();

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			assertBlockData((data) => {
				expect('200px').to.be.equal(
					getSelectedBlock(data, 'blockeraHeight')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').clear();
				cy.get('@containerInput').type('300', { force: true });
			});

			// Blockera value should be moved to WP data
			assertBlockData((data) => {
				expect('300px').to.be.equal(getSelectedBlock(data, 'height'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			assertBlockData((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'height'));
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:post-featured-image {"aspectRatio":"auto","height":"30%"} /-->'
			);

			// Select target block
			cy.getBlock('core/post-featured-image').click();

			// add alias to the feature container
			cy.getParentContainer('Height').as('container');

			cy.addNewTransition();

			//
			// Test 1: Blockera dat to WP
			//

			// WP data should come to Blockera
			assertBlockData((data) => {
				expect('30%').to.be.equal(
					getSelectedBlock(data, 'blockeraHeight')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('select').select('auto');
			});

			// Blockera value should be moved to WP data
			assertBlockData((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'height'));
			});
		});
	});

	describe('core/spacer Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				`<!-- wp:spacer {"height":"200px"} -->
<div style="height:200px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->`
			);

			// Select target block
			cy.getBlock('core/spacer').click({ force: true });

			// add alias to the feature container
			cy.getParentContainer('Height').as('container');

			cy.setInputFieldValue('Width', 'Size', 100);

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			assertBlockData((data) => {
				expect('200px').to.be.equal(
					getSelectedBlock(data, 'blockeraHeight')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').clear();
				cy.get('@containerInput').type('300', { force: true });
			});

			// Blockera value should be moved to WP data
			assertBlockData((data) => {
				expect('300px').to.be.equal(getSelectedBlock(data, 'height'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			assertBlockData((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'height'));
			});
		});

		it('Spacing preset variable (WP → Blockera)', () => {
			appendBlocks(
				`<!-- wp:spacer {"height":"var(--wp--preset--spacing--30, 20px)"} -->
<div style="height:var(--wp--preset--spacing--30, 20px)" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->`
			);

			cy.getBlock('core/spacer').click({ force: true });

			cy.setInputFieldValue('Width', 'Size', 100);

			assertBlockData((data) => {
				const heightVA = getSelectedBlock(data, 'blockeraHeight');

				expect(heightVA).to.deep.include({
					isValueAddon: true,
					valueType: 'variable',
				});
				expect(heightVA.settings).to.deep.include({
					id: '30',
					type: 'spacing',
					var: '--wp--preset--spacing--30',
					value: '20px',
				});
			});

			assertBlockData((data) => {
				const wpHeight = getSelectedBlock(data, 'height');

				expect(wpHeight).to.be.a('string');
				expect(wpHeight).to.include('--wp--preset--spacing--30');
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				`<!-- wp:spacer {"height":"30%"} -->
<div style="height:30%" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --> `
			);

			// Select target block
			cy.getBlock('core/spacer').click({ force: true });

			// add alias to the feature container
			cy.getParentContainer('Height').as('container');

			cy.setInputFieldValue('Width', 'Size', 100);

			//
			// Test 1: Blockera dat to WP
			//

			// WP data should come to Blockera
			assertBlockData((data) => {
				expect('30%').to.be.equal(
					getSelectedBlock(data, 'blockeraHeight')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('select').select('auto');
			});

			// Blockera value should be moved to WP data
			assertBlockData((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'height'));
			});
		});
	});
});
