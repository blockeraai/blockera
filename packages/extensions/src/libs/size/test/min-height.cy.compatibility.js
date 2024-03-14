/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

describe('Min Height → WP Compatibility', () => {
	describe('core/image Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:cover {"url":"https://placehold.co/600x400","id":60,"dimRatio":50,"minHeight":300,"minHeightUnit":"px","layout":{"type":"constrained"}} -->\n' +
					'<div class="wp-block-cover" style="min-height:300px"><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><img class="wp-block-cover__image-background wp-image-60" alt="" src="https://placehold.co/600x400" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","placeholder":"Write title…","fontSize":"large"} -->\n' +
					'<p class="has-text-align-center has-large-font-size">Cover Text</p>\n' +
					'<!-- /wp:paragraph --></div></div>\n' +
					'<!-- /wp:cover -->'
			);

			// Select target block
			cy.get('[data-type="core/cover"]').click();

			// switch to cover block
			cy.get('[aria-label="Select Cover"]').click();

			// add alias to the feature container
			cy.get('[aria-label="Min"]')
				.closest('[data-cy="base-control"]')
				.as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('300px').to.be.equal(
					getSelectedBlock(data, 'publisherMinHeight')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').type('1', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(3001).to.be.equal(getSelectedBlock(data, 'minHeight'));
				expect('px').to.be.equal(
					getSelectedBlock(data, 'minHeightUnit')
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'minHeight')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'minHeightUnit')
				);
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:cover {"url":"https://placehold.co/600x400","id":60,"dimRatio":50,"layout":{"type":"constrained"}} -->\n' +
					'<div class="wp-block-cover"><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><img class="wp-block-cover__image-background wp-image-60" alt="" src="https://placehold.co/600x400" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","placeholder":"Write title…","fontSize":"large"} -->\n' +
					'<p class="has-text-align-center has-large-font-size">Cover Text</p>\n' +
					'<!-- /wp:paragraph --></div></div>\n' +
					'<!-- /wp:cover -->'
			);

			// Select target block
			cy.get('[data-type="core/cover"]').click();

			// switch to cover block
			cy.get('[aria-label="Select Cover"]').click();

			//
			// Test 1: Blockera data to WP
			//

			// open settings
			cy.get('[aria-label="More Size Settings"]').click();

			// activate min height
			cy.get('[aria-label="Activate Min Height"]').click();

			// add alias to the feature container
			cy.get('[aria-label="Min"]')
				.closest('[data-cy="base-control"]')
				.as('container');

			// change value
			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').type('300', { force: true });
				cy.get('[aria-label="Select Unit"]').select('px');
			});

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('300px').to.be.equal(
					getSelectedBlock(data, 'publisherMinHeight')
				);

				expect(300).to.be.equal(getSelectedBlock(data, 'minHeight'));

				expect('px').to.be.equal(
					getSelectedBlock(data, 'minHeightUnit')
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
				cy.get('[aria-label="Select Unit"]').select('%');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(200).to.be.equal(getSelectedBlock(data, 'minHeight'));

				expect('%').to.be.equal(
					getSelectedBlock(data, 'minHeightUnit')
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'minHeight')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'minHeightUnit')
				);
			});
		});
	});
});
