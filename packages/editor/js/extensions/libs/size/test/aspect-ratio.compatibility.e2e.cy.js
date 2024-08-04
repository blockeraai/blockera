/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Aspect Ratio → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	// The "core/post-featured-image" is the same as "core/image"
	describe('core/image Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:image {"id":60,"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","linkDestination":"none","className":"is-resized"} -->\n' +
					'<figure class="wp-block-image size-full is-resized"><img src="https://placehold.co/600x400" alt="" class="wp-image-60" style="aspect-ratio:4/3;object-fit:cover"/></figure>\n' +
					'<!-- /wp:image -->'
			);

			// Select target block
			cy.getBlock('core/image').click();

			// add alias to the feature container
			cy.getParentContainer('Aspect Ratio', 'base-control').as(
				'aspectContainer'
			);

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('4/3').to.be.equal(
					getSelectedBlock(data, 'aspectRatio')
				);

				expect({
					value: '4/3',
					width: '',
					height: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@aspectContainer').within(() => {
				cy.get('select').as('aspectSelect');
				cy.get('@aspectSelect').select('16/9');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('16/9').to.be.equal(
					getSelectedBlock(data, 'aspectRatio')
				);

				expect({
					value: '16/9',
					width: '',
					height: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@aspectContainer').within(() => {
				cy.get('select').select('', { force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'aspectRatio')
				);

				expect({
					value: '',
					width: '',
					height: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
			});
		});

		it('Use custom aspect ratio - WP6.6 compatibility', () => {
			appendBlocks(
				'<!-- wp:image {"id":60,"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","linkDestination":"none","className":"is-resized"} -->\n' +
					'<figure class="wp-block-image size-full is-resized"><img src="https://placehold.co/600x400" alt="" class="wp-image-60" style="aspect-ratio:4/3;object-fit:cover"/></figure>\n' +
					'<!-- /wp:image -->'
			);

			// Select target block
			cy.getBlock('core/image').click();

			// add alias to the feature container
			cy.getParentContainer('Aspect Ratio', 'base-control').as(
				'aspectContainer'
			);

			getWPDataObject().then((data) => {
				expect('4/3').to.be.equal(
					getSelectedBlock(data, 'aspectRatio')
				);

				expect({
					value: '4/3',
					width: '',
					height: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
			});

			//
			// Test 1: Blockera data to WP
			//

			// change value
			cy.get('@aspectContainer').within(() => {
				cy.get('select').as('aspectSelect');
				cy.get('@aspectSelect').select('custom', { force: true });

				// set width
				cy.get('input').eq(0).type('2');

				// set height
				cy.get('input').eq(1).type('3');
			});

			getWPDataObject().then((data) => {
				expect('2/3').to.be.equal(
					getSelectedBlock(data, 'aspectRatio')
				);

				expect({
					value: 'custom',
					width: 2,
					height: 3,
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			// only % is valid for WP
			cy.get('@aspectContainer').within(() => {
				cy.get('select').as('aspectSelect');
				cy.get('@aspectSelect').select('', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'aspectRatio')
				);

				expect({
					value: '',
					width: '',
					height: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
			});
		});
	});

	describe('core/cover Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				`<!-- wp:cover {"url":"https://placehold.co/600x400","id":27,"dimRatio":50,"customOverlayColor":"#5c594d","style":{"dimensions":{"aspectRatio":"3/2"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-cover"><span aria-hidden="true" class="wp-block-cover__background has-background-dim" style="background-color:#5c594d"></span><img class="wp-block-cover__image-background wp-image-27" alt="" src="https://placehold.co/600x400" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","placeholder":"Write title…","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Test text</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover -->`
			);

			cy.getBlock('core/cover').click();

			// Switch to parent block
			cy.getByAriaLabel(
				'Select Cover',
				'Select parent block: Cover'
			).click();

			cy.getParentContainer('Aspect Ratio', 'base-control').as(
				'aspectContainer'
			);

			//
			// Test 1: WP data to Blockera
			//

			getWPDataObject().then((data) => {
				expect('3/2').to.be.equal(
					getSelectedBlock(data, 'style')?.dimensions?.aspectRatio
				);

				expect({
					value: '3/2',
					width: '',
					height: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
			});

			// Test 2: Blockera value to WP data

			// change value
			cy.get('@aspectContainer').within(() => {
				cy.get('select').as('aspectSelect');
				cy.get('@aspectSelect').select('16/9');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('16/9').to.be.equal(
					getSelectedBlock(data, 'style')?.dimensions?.aspectRatio
				);

				expect({
					value: '16/9',
					width: '',
					height: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@aspectContainer').within(() => {
				cy.get('select').select('', { force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.dimensions?.aspectRatio
				);

				expect({
					value: '',
					width: '',
					height: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
			});
		});

		it('Use custom aspect ratio - WP6.6 compatibility', () => {
			appendBlocks(
				`<!-- wp:cover {"url":"https://placehold.co/600x400","id":27,"dimRatio":50,"customOverlayColor":"#5c594d","style":{"dimensions":{"aspectRatio":"3/2"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-cover"><span aria-hidden="true" class="wp-block-cover__background has-background-dim" style="background-color:#5c594d"></span><img class="wp-block-cover__image-background wp-image-27" alt="" src="https://placehold.co/600x400" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","placeholder":"Write title…","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Test text</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover -->`
			);

			cy.getBlock('core/cover').click();

			// Switch to parent block
			cy.getByAriaLabel(
				'Select Cover',
				'Select parent block: Cover'
			).click();

			// add alias to the feature container
			cy.getParentContainer('Aspect Ratio', 'base-control').as(
				'aspectContainer'
			);

			getWPDataObject().then((data) => {
				expect('3/2').to.be.equal(
					getSelectedBlock(data, 'style')?.dimensions?.aspectRatio
				);

				expect({
					value: '3/2',
					width: '',
					height: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
			});

			//
			// Test 1: Blockera data to WP
			//

			// change value
			cy.get('@aspectContainer').within(() => {
				cy.get('select').as('aspectSelect');
				cy.get('@aspectSelect').select('custom', { force: true });

				// set width
				cy.get('input').eq(0).type('2');

				// set height
				cy.get('input').eq(1).type('3');
			});

			getWPDataObject().then((data) => {
				expect('2/3').to.be.equal(
					getSelectedBlock(data, 'style')?.dimensions?.aspectRatio
				);

				expect({
					value: 'custom',
					width: 2,
					height: 3,
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			// only % is valid for WP
			cy.get('@aspectContainer').within(() => {
				cy.get('select').as('aspectSelect');
				cy.get('@aspectSelect').select('', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'aspectRatio')
				);

				expect({
					value: '',
					width: '',
					height: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
			});
		});
	});
});
