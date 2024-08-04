/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	getSelectedBlock,
	getWPDataObject,
} from '@blockera/dev-cypress/js/helpers';

describe('Background → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Group Block', () => {
		describe('Background Repeat', () => {
			it('no value - default is "repeat"', () => {
				appendBlocks(
					`<!-- wp:group {"style":{"background":{"backgroundImage":{"url":"https://placehold.co/600x400","id":0,"source":"file","title":"background image"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph inside group block</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
				);

				// Select target block
				cy.getBlock('core/paragraph').click();

				// Switch to parent block
				cy.getByAriaLabel(
					'Select Group',
					'Select parent block: Group'
				).click();

				// add alias to the feature container
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				// default position is 50% 50%
				getWPDataObject().then((data) => {
					expect({
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'custom',
							'image-size-width': 'auto',
							'image-size-height': 'auto',
							'image-position': {
								top: '50%',
								left: '50%',
							},
							'image-repeat': 'repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundRepeat
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="image-0"]').as('repeaterBtn');
					cy.get('@repeaterBtn').click();
				});

				//
				// change: background repeat to no-repeat
				//
				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.get('button[data-value="no-repeat"]').click();
					});

				// Blockera value should be moved to WP data
				getWPDataObject().then((data) => {
					expect({
						url: 'https://placehold.co/600x400',
						id: 0,
						source: 'file',
						title: 'background image',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundImage
					);

					expect('no-repeat').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundRepeat
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear bg color
				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete image 0').click({
						force: true,
					});
				});

				// WP data should be removed too
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundImage
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundRepeat
					);

					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});
			});

			it('no-repeat value', () => {
				appendBlocks(
					`<!-- wp:group {"style":{"background":{"backgroundImage":{"url":"https://placehold.co/600x400","id":0,"source":"file","title":"background-image"},"backgroundPosition":"50% 50%","backgroundSize":"contain","backgroundRepeat":"no-repeat"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test paragraph...</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
				);

				// Select target block
				cy.getBlock('core/paragraph').click();

				// Switch to parent block
				cy.getByAriaLabel(
					'Select Group',
					'Select parent block: Group'
				).click();

				// add alias to the feature container
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				// default position is 50% 50%
				getWPDataObject().then((data) => {
					expect({
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'contain',
							'image-size-width': 'auto',
							'image-size-height': 'auto',
							'image-position': {
								top: '50%',
								left: '50%',
							},
							'image-repeat': 'no-repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);

					expect('no-repeat').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundRepeat
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="image-0"]').as('repeaterBtn');
					cy.get('@repeaterBtn').click();
				});

				//
				// change: background repeat to repeat
				//
				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.get('button[data-value="repeat"]').click();
					});

				// Blockera value should be moved to WP data
				getWPDataObject().then((data) => {
					expect({
						url: 'https://placehold.co/600x400',
						id: 0,
						source: 'file',
						title: 'background image',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundImage
					);

					// repeat is default and should be removed
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundRepeat
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear bg color
				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete image 0').click({
						force: true,
					});
				});

				// WP data should be removed too
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundImage
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundRepeat
					);

					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});
			});

			it('assert switching to repeat values that WP does not support', () => {
				appendBlocks(
					`<!-- wp:group {"style":{"background":{"backgroundImage":{"url":"https://placehold.co/600x400","id":0,"source":"file","title":"background-image"},"backgroundPosition":"50% 50%","backgroundSize":"contain","backgroundRepeat":"no-repeat"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test paragraph...</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
				);

				// Select target block
				cy.getBlock('core/paragraph').click();

				// Switch to parent block
				cy.getByAriaLabel(
					'Select Group',
					'Select parent block: Group'
				).click();

				// add alias to the feature container
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				// default position is 50% 50%
				getWPDataObject().then((data) => {
					expect({
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'contain',
							'image-size-width': 'auto',
							'image-size-height': 'auto',
							'image-position': {
								top: '50%',
								left: '50%',
							},
							'image-repeat': 'no-repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);

					expect('no-repeat').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundRepeat
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="image-0"]').as('repeaterBtn');
					cy.get('@repeaterBtn').click();
				});

				//
				// change: background repeat to repeat
				//
				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.get('button[data-value="repeat"]').click();
					});

				// Blockera value should be moved to WP data
				getWPDataObject().then((data) => {
					// repeat is default and should be removed
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundRepeat
					);
				});

				//
				// change: background repeat to repeat-x
				//
				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.get('button[data-value="repeat-x"]').click();
					});

				getWPDataObject().then((data) => {
					// repeat-x does not supported by wp and should be removed
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundRepeat
					);
				});

				//
				// change: background repeat to repeat-y
				//
				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.get('button[data-value="repeat-y"]').click();
					});

				getWPDataObject().then((data) => {
					// repeat-y does not supported by wp and should be removed
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundRepeat
					);
				});

				//
				// change: background repeat to no-repeat
				//
				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.get('button[data-value="no-repeat"]').click();
					});

				getWPDataObject().then((data) => {
					// no-repeat is supported
					expect('no-repeat').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundRepeat
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear bg color
				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete image 0').click({
						force: true,
					});
				});

				// WP data should be removed too
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundImage
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundRepeat
					);

					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});
			});
		});
	});
});
