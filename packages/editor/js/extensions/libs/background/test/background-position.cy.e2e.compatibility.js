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
		describe('Background Position', () => {
			it('no value', () => {
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
							?.backgroundPosition
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
				// change: background position
				//
				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.getParentContainer('Top').within(() => {
							cy.get('input').clear();
							cy.get('input').type('20');
						});

						cy.getParentContainer('Left').within(() => {
							cy.get('input').clear();
							cy.get('input').type('30');
						});
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

					expect('20% 30%').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundPosition
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
							?.backgroundPosition
					);

					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});
			});

			it('simple custom value', () => {
				appendBlocks(
					`<!-- wp:group {"style":{"background":{"backgroundImage":{"url":"https://placehold.co/600x400","id":0,"source":"file","title":"background image"},"backgroundPosition":"30% 15%"}},"layout":{"type":"constrained"}} -->
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
							'image-size': 'custom',
							'image-size-width': 'auto',
							'image-size-height': 'auto',
							'image-position': {
								top: '30%',
								left: '15%',
							},
							'image-repeat': 'repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);

					expect('30% 15%').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundPosition
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
				// change: background position
				//
				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.getParentContainer('Top').within(() => {
							cy.get('input').clear();
							cy.get('input').type('100');
						});

						cy.getParentContainer('Left').within(() => {
							cy.get('input').clear();
							cy.get('input').type('100');
						});
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

					expect('100% 100%').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundPosition
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
							?.backgroundPosition
					);

					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});
			});
		});
	});
});
