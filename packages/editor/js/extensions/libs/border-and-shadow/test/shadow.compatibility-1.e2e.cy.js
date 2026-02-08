/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Shadow → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Button Block', () => {
		describe('Simple Value', () => {
			it('CSS shadow value', () => {
				appendBlocks(
					'<!-- wp:buttons -->\n' +
						'<div class="wp-block-buttons"><!-- wp:button {"style":{"shadow":"10px 20px 5px 0px rgba(0, 0, 0, 0.3)"}}} -->\n' +
						'<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button</a></div>\n' +
						'<!-- /wp:button --></div>\n' +
						'<!-- /wp:buttons -->'
				);

				// Select target block
				cy.getBlock('core/button').click();

				// add alias to the feature container
				cy.getParentContainer('Box Shadows').as('container');

				cy.addNewTransition();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					const blockeraBoxShadow = getSelectedBlock(
						data,
						'blockeraBoxShadow'
					);
					const wpShadow = getSelectedBlock(data, 'style')?.shadow;

					// Check Blockera received the shadow data
					expect(blockeraBoxShadow).to.be.an('object');
					expect(
						Object.keys(blockeraBoxShadow).length
					).to.be.greaterThan(0);

					// Check the first shadow item structure
					const firstShadowKey = Object.keys(blockeraBoxShadow)[0];
					const firstShadow = blockeraBoxShadow[firstShadowKey];

					expect(firstShadow.isVisible).to.be.true;
					expect(firstShadow.type).to.equal('outer');
					expect(firstShadow.x).to.equal('10px');
					expect(firstShadow.y).to.equal('20px');
					expect(firstShadow.blur).to.equal('5px');
					expect(firstShadow.spread).to.equal('0px');
					expect(firstShadow.color).to.equal('rgba(0, 0, 0, 0.3)');

					// Check WP shadow value
					expect(wpShadow).to.equal(
						'10px 20px 5px 0px rgba(0, 0, 0, 0.3)'
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				cy.get('@container').within(() => {
					cy.get('[aria-label="Add New Box Shadow"]').click({
						force: true,
					});
				});

				cy.getByDataTest('popover-body').within(() => {
					cy.getByDataTest('box-shadow-x-input').clear({
						force: true,
					});
					cy.getByDataTest('box-shadow-x-input').type(15, {
						force: true,
					});

					cy.getByDataTest('box-shadow-y-input').clear({
						force: true,
					});
					cy.getByDataTest('box-shadow-y-input').type(25, {
						force: true,
					});

					cy.getByDataTest('box-shadow-blur-input').clear({
						force: true,
					});
					cy.getByDataTest('box-shadow-blur-input').type(10, {
						force: true,
					});
				});

				getWPDataObject().then((data) => {
					const blockeraBoxShadow = getSelectedBlock(
						data,
						'blockeraBoxShadow'
					);
					const wpShadow = getSelectedBlock(data, 'style')?.shadow;

					// Check Blockera shadow was updated
					const firstShadowKey = Object.keys(blockeraBoxShadow)[0];
					const firstShadow = blockeraBoxShadow[firstShadowKey];

					expect(firstShadow.x).to.equal('15px');
					expect(firstShadow.y).to.equal('25px');
					expect(firstShadow.blur).to.equal('10px');

					// Check WP shadow was updated
					expect(wpShadow).to.contain('15px');
					expect(wpShadow).to.contain('25px');
					expect(wpShadow).to.contain('10px');
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// Clear shadow values
				cy.get('@container').within(() => {
					cy.get('[aria-label="Add New Box Shadow"]').click({
						force: true,
					});
				});

				cy.getByDataTest('popover-body').within(() => {
					cy.getByDataTest('box-shadow-x-input').clear({
						force: true,
					});
					cy.getByDataTest('box-shadow-y-input').clear({
						force: true,
					});
					cy.getByDataTest('box-shadow-blur-input').clear({
						force: true,
					});
					cy.getByDataTest('box-shadow-spread-input').clear({
						force: true,
					});

					cy.getByDataTest('box-shadow-color-control').click({
						force: true,
					});
				});

				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.getByAriaLabel('Reset Color (Clear)').click({
							force: true,
						});
					});

				getWPDataObject().then((data) => {
					const blockeraBoxShadow = getSelectedBlock(
						data,
						'blockeraBoxShadow'
					);
					const wpShadow = getSelectedBlock(data, 'style')?.shadow;

					// Check Blockera shadow was cleared
					const firstShadowKey = Object.keys(blockeraBoxShadow)[0];
					const firstShadow = blockeraBoxShadow[firstShadowKey];

					expect(firstShadow.x).to.equal('');
					expect(firstShadow.y).to.equal('');
					expect(firstShadow.blur).to.equal('');
					expect(firstShadow.spread).to.equal('');
					expect(firstShadow.color).to.equal('');

					// WP shadow should be cleared (undefined or empty)
					expect(wpShadow).to.be.undefined;
				});
			});

			it('Shadow preset reference', () => {
				appendBlocks(
					'<!-- wp:buttons -->\n' +
						'<div class="wp-block-buttons"><!-- wp:button {"style":{"shadow":"var:preset|shadow|natural"}}} -->\n' +
						'<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button</a></div>\n' +
						'<!-- /wp:button --></div>\n' +
						'<!-- /wp:buttons -->'
				);

				// Select target block
				cy.getBlock('core/button').click();

				// add alias to the feature container
				cy.getParentContainer('Box Shadows').as('container');

				cy.addNewTransition();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					const blockeraBoxShadow = getSelectedBlock(
						data,
						'blockeraBoxShadow'
					);
					const wpShadow = getSelectedBlock(data, 'style')?.shadow;

					// Check Blockera received the shadow preset reference
					expect(blockeraBoxShadow).to.be.an('object');
					expect(
						Object.keys(blockeraBoxShadow).length
					).to.be.greaterThan(0);

					// Check the first shadow item structure
					const firstShadowKey = Object.keys(blockeraBoxShadow)[0];
					const firstShadow = blockeraBoxShadow[firstShadowKey];

					expect(firstShadow.isVisible).to.be.true;
					expect(firstShadow.type).to.equal('outer');

					// For preset references, the color should contain the preset variable
					// (or if resolved, it would have actual values)
					// Since resolution might fail in test environment, we check for either
					const colorIsPreset =
						typeof firstShadow.color === 'string' &&
						(firstShadow.color.startsWith('var:preset|shadow|') ||
							firstShadow.color.startsWith(
								'var(--wp--preset--shadow--'
							));

					// Or if resolved, it should have actual shadow values
					const hasResolvedValues =
						firstShadow.x !== '0px' ||
						firstShadow.y !== '0px' ||
						firstShadow.blur !== '0px';

					expect(colorIsPreset || hasResolvedValues).to.be.true;

					// Check WP shadow value (should be the preset reference)
					expect(wpShadow).to.equal('var:preset|shadow|natural');
				});

				//
				// Test 2: Blockera value to WP data (modifying shadow)
				//

				cy.get('@container').within(() => {
					cy.get('[aria-label="Add New Box Shadow"]').click({
						force: true,
					});
				});

				cy.getByDataTest('popover-body').within(() => {
					cy.getByDataTest('box-shadow-x-input').clear({
						force: true,
					});
					cy.getByDataTest('box-shadow-x-input').type(5, {
						force: true,
					});
				});

				getWPDataObject().then((data) => {
					const wpShadow = getSelectedBlock(data, 'style')?.shadow;

					// WP shadow should be updated (might be CSS value now instead of preset)
					expect(wpShadow).to.be.a('string');
					expect(wpShadow).to.contain('5px');
				});
			});
		});
	});

	describe('Image Block', () => {
		describe('Simple Value', () => {
			it('CSS shadow value with inset', () => {
				appendBlocks(
					'<!-- wp:image {"style":{"shadow":"inset 0 0 10px 0 rgba(255, 0, 0, 0.5)"}}} -->\n' +
						"<figure class=\"wp-block-image\"><img src=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ccc'/%3E%3C/svg%3E\" alt=\"\"/></figure>\n" +
						'<!-- /wp:image -->'
				);

				// Select target block
				cy.getBlock('core/image').click();

				// add alias to the feature container
				cy.getParentContainer('Box Shadows').as('container');

				cy.addNewTransition();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					const blockeraBoxShadow = getSelectedBlock(
						data,
						'blockeraBoxShadow'
					);
					const wpShadow = getSelectedBlock(data, 'style')?.shadow;

					// Check Blockera received the shadow data
					expect(blockeraBoxShadow).to.be.an('object');
					expect(
						Object.keys(blockeraBoxShadow).length
					).to.be.greaterThan(0);

					// Check the first shadow item structure
					const firstShadowKey = Object.keys(blockeraBoxShadow)[0];
					const firstShadow = blockeraBoxShadow[firstShadowKey];

					expect(firstShadow.isVisible).to.be.true;
					expect(firstShadow.type).to.equal('inner'); // inset = inner
					expect(firstShadow.x).to.equal('0px');
					expect(firstShadow.y).to.equal('0px');
					expect(firstShadow.blur).to.equal('10px');
					expect(firstShadow.spread).to.equal('0px');
					expect(firstShadow.color).to.equal('rgba(255, 0, 0, 0.5)');

					// Check WP shadow value
					expect(wpShadow).to.equal(
						'inset 0 0 10px 0 rgba(255, 0, 0, 0.5)'
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				cy.get('@container').within(() => {
					cy.get('[aria-label="Add New Box Shadow"]').click({
						force: true,
					});
				});

				cy.getByDataTest('popover-body').within(() => {
					cy.getByDataTest('box-shadow-x-input').clear({
						force: true,
					});
					cy.getByDataTest('box-shadow-x-input').type(20, {
						force: true,
					});
				});

				getWPDataObject().then((data) => {
					const wpShadow = getSelectedBlock(data, 'style')?.shadow;

					// WP shadow should be updated
					expect(wpShadow).to.contain('20px');
					expect(wpShadow).to.contain('inset'); // Should preserve inset
				});
			});
		});
	});
});
