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
		describe('Background Size', () => {
			it('simple value → cover', () => {
				appendBlocks(
					`<!-- wp:group {"style":{"background":{"backgroundSize":"cover","backgroundRepeat":"no-repeat","backgroundPosition":"20% 30%","backgroundImage":{"url":"https://placehold.co/600x400","id":0,"source":"file","title":"background image"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test paragraph....</p>
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
				getWPDataObject().then((data) => {
					expect({
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'cover',
							'image-size-width': 'auto',
							'image-size-height': 'auto',
							'image-position': {
								top: '20%',
								left: '30%',
							},
							'image-repeat': 'no-repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="image-0"]').as('repeaterBtn');
					cy.get('@repeaterBtn').click();
				});

				//
				// change: background size → contain
				//
				cy.get('.components-popover').within(() => {
					cy.get('[data-value="contain"]').click();
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

					expect('contain').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundSize
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
				});

				getWPDataObject().then((data) => {
					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});
			});

			it('simple value → contain', () => {
				appendBlocks(
					`<!-- wp:group {"style":{"background":{"backgroundSize":"contain","backgroundRepeat":"no-repeat","backgroundPosition":"20% 30%","backgroundImage":{"url":"https://placehold.co/600x400","id":0,"source":"file","title":"background image"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test paragraph....</p>
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
								top: '20%',
								left: '30%',
							},
							'image-repeat': 'no-repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="image-0"]').as('repeaterBtn');
					cy.get('@repeaterBtn').click();
				});

				//
				// change: background size → contain
				//
				cy.get('.components-popover').within(() => {
					cy.get('[data-value="cover"]').click();
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

					expect('cover').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundSize
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
				});

				getWPDataObject().then((data) => {
					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});
			});

			it('simple value → auto', () => {
				appendBlocks(
					`<!-- wp:group {"style":{"background":{"backgroundSize":"auto","backgroundRepeat":"no-repeat","backgroundPosition":"20% 30%","backgroundImage":{"url":"https://placehold.co/600x400","id":0,"source":"file","title":"background image"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test paragraph....</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --> `
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
								top: '20%',
								left: '30%',
							},
							'image-repeat': 'no-repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="image-0"]').as('repeaterBtn');
					cy.get('@repeaterBtn').click();
				});

				//
				// change: background size → change to customized width
				//
				cy.get('.components-popover').within(() => {
					cy.getParentContainer('Width').within(() => {
						cy.get('select').select('px');
						cy.get('input').type('10');
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

					expect('10px').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundSize
					);

					expect({
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'custom',
							'image-size-width': '10px',
							'image-size-height': 'auto',
							'image-position': {
								top: '20%',
								left: '30%',
							},
							'image-repeat': 'no-repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});

				//
				// change: background size → change to auto
				//
				cy.get('.components-popover').within(() => {
					cy.getParentContainer('Width').within(() => {
						cy.get('select').select('auto');
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

					expect('auto').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundSize
					);

					expect({
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'custom',
							'image-size-width': 'auto',
							'image-size-height': 'auto',
							'image-position': {
								top: '20%',
								left: '30%',
							},
							'image-repeat': 'no-repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});

				//
				// change: background size → change to contain
				//
				cy.get('.components-popover').within(() => {
					cy.get('[data-value="contain"]').click();
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

					expect('contain').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundSize
					);

					expect({
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'contain',
							'image-size-width': 'auto',
							'image-size-height': 'auto',
							'image-position': {
								top: '20%',
								left: '30%',
							},
							'image-repeat': 'no-repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
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
							?.backgroundSize
					);

					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});
			});

			it('simple value → custom value', () => {
				appendBlocks(
					`<!-- wp:group {"style":{"background":{"backgroundSize":"100px","backgroundRepeat":"no-repeat","backgroundPosition":"20% 30%","backgroundImage":{"url":"https://placehold.co/600x400","id":0,"source":"file","title":"background image"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test paragraph....</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --> `
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
				getWPDataObject().then((data) => {
					expect({
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'custom',
							'image-size-width': '100px',
							'image-size-height': 'auto',
							'image-position': {
								top: '20%',
								left: '30%',
							},
							'image-repeat': 'no-repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="image-0"]').as('repeaterBtn');
					cy.get('@repeaterBtn').click();
				});

				//
				// change: background size → change to customized width
				//
				cy.get('.components-popover').within(() => {
					cy.getParentContainer('Width').within(() => {
						cy.get('input').clear({ force: true });
						cy.get('input').type('200');
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

					expect('200px').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundSize
					);

					expect({
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'custom',
							'image-size-width': '200px',
							'image-size-height': 'auto',
							'image-position': {
								top: '20%',
								left: '30%',
							},
							'image-repeat': 'no-repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});

				//
				// change: background size → change to auto
				//
				cy.get('.components-popover').within(() => {
					cy.getParentContainer('Width').within(() => {
						cy.get('select').select('auto');
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

					expect('auto').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundSize
					);

					expect({
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'custom',
							'image-size-width': 'auto',
							'image-size-height': 'auto',
							'image-position': {
								top: '20%',
								left: '30%',
							},
							'image-repeat': 'no-repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});

				//
				// change: background size → change to contain
				//
				cy.get('.components-popover').within(() => {
					cy.get('[data-value="contain"]').click();
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

					expect('contain').to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundSize
					);

					expect({
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'contain',
							'image-size-width': 'auto',
							'image-size-height': 'auto',
							'image-position': {
								top: '20%',
								left: '30%',
							},
							'image-repeat': 'no-repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
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
							?.backgroundSize
					);

					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});
			});
		});
	});
});
