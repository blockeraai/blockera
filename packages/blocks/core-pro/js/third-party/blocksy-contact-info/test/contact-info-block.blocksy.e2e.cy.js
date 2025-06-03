/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
	setInnerBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Blocksy → Contact Info Block → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Icons Border Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"customBorderColor":"#0066ff","lock":{"remove":true}} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/contact-info').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('rgba(218, 222, 228, 0.5)').to.be.equal(
						getSelectedBlock(data, 'borderColor')
					);

					expect('#0066ff').to.be.equal(
						getSelectedBlock(data, 'customBorderColor')
					);

					expect('#0066ff').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBorder?.all?.color
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/icons');

				cy.getParentContainer('Border Line').within(() => {
					cy.getByDataTest('border-control-color').click();
				});

				// color
				cy.getByDataTest('popover-body')
					.last()
					.within(() => {
						cy.get('input[maxlength="9"]').clear({ force: true });
						cy.get('input[maxlength="9"]').type('9958e3 ');
					});

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'borderColor')
					);

					expect('#9958e3').to.be.equal(
						getSelectedBlock(data, 'customBorderColor')
					);

					expect('#9958e3').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBorder?.all?.color
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute(
					'Border And Shadow',
					'Border Line',
					'reset'
				);

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'borderColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customBorderColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBorder?.all?.color
					);
				});
			});
		});
	});
});
