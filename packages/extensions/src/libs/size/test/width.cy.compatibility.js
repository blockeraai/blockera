/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Width → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('core/search Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:search {"label":"Search","width":500,"widthUnit":"px","buttonText":"Search"} /-->'
			);

			// Select target block
			cy.getBlock('core/search').click();

			// add alias to the feature container
			cy.getParentContainer('Width').as('widthContainer');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('500px').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@widthContainer').within(() => {
				cy.get('input').as('widthInput');
				cy.get('@widthInput').clear();
				cy.get('@widthInput').type('100', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(100).to.be.equal(getSelectedBlock(data, 'width'));

				expect('px').to.be.equal(getSelectedBlock(data, 'widthUnit'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@widthContainer').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'widthUnit')
				);
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:search {"label":"Search","width":500,"widthUnit":"px","buttonText":"Search"} /-->'
			);

			// Select target block
			cy.getBlock('core/search').click();

			// add alias to the feature container
			cy.getParentContainer('Width').as('widthContainer');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('500px').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera invalid value -> do not move to WP
			//

			cy.get('@widthContainer').within(() => {
				cy.get('select').select('auto', {
					force: true,
				});
			});

			// Blockera value should NOT be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'widthUnit')
				);
			});

			//
			// Test 3: Switch back to valid data (%)
			//

			cy.get('@widthContainer').within(() => {
				cy.get('select').select('%');

				cy.get('input').as('widthInput');
				cy.get('@widthInput').clear();
				cy.get('@widthInput').type('100', { force: true });
			});

			// WP data should be
			getWPDataObject().then((data) => {
				expect(100).to.be.equal(getSelectedBlock(data, 'width'));

				expect('%').to.be.equal(getSelectedBlock(data, 'widthUnit'));
			});
		});
	});

	describe('core/site-logo Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:site-logo {"width":100,"shouldSyncIcon":false} /-->'
			);

			// Select target block
			cy.getBlock('core/site-logo').click();

			// add alias to the feature container
			cy.getParentContainer('Width').as('widthContainer');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('100px').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@widthContainer').within(() => {
				cy.get('input').as('widthInput');
				cy.get('@widthInput').clear();
				cy.get('@widthInput').type('200', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(200).to.be.equal(getSelectedBlock(data, 'width'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@widthContainer').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:site-logo {"width":100,"shouldSyncIcon":false} /-->'
			);

			// Select target block
			cy.getBlock('core/site-logo').click();

			// add alias to the feature container
			cy.getParentContainer('Width').as('widthContainer');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('100px').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@widthContainer').within(() => {
				cy.get('input').as('widthInput');
				cy.get('@widthInput').clear();
				cy.get('@widthInput').type('200', { force: true });
				cy.get('select').select('%');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@widthContainer').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});
		});
	});

	describe('core/button Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:buttons -->\n' +
					'<div class="wp-block-buttons"><!-- wp:button {"width":25} -->\n' +
					'<div class="wp-block-button has-custom-width wp-block-button__width-25"><a class="wp-block-button__link wp-element-button">button</a></div>\n' +
					'<!-- /wp:button --></div>\n' +
					'<!-- /wp:buttons -->'
			);

			// Select target block
			cy.getBlock('core/button').click();

			// add alias to the feature container
			cy.getParentContainer('Width').as('widthContainer');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('25%').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@widthContainer').within(() => {
				cy.get('input').as('widthInput');
				cy.get('@widthInput').clear();
				cy.get('@widthInput').type('50', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(50).to.be.equal(getSelectedBlock(data, 'width'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@widthContainer').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:buttons -->\n' +
					'<div class="wp-block-buttons"><!-- wp:button {"width":25} -->\n' +
					'<div class="wp-block-button has-custom-width wp-block-button__width-25"><a class="wp-block-button__link wp-element-button">button</a></div>\n' +
					'<!-- /wp:button --></div>\n' +
					'<!-- /wp:buttons -->'
			);

			// Select target block
			cy.getBlock('core/button').click();

			// add alias to the feature container
			cy.getParentContainer('Width').as('widthContainer');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('25%').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			// only % is valid for WP
			cy.get('@widthContainer').within(() => {
				cy.get('input').as('widthInput');
				cy.get('@widthInput').clear();
				cy.get('@widthInput').type('50', { force: true });
				cy.get('select').select('px');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@widthContainer').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});
		});
	});

	describe('core/image Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:image {"id":60,"width":"500px","sizeSlug":"full","linkDestination":"none"} -->\n' +
					'<figure class="wp-block-image size-full is-resized"><img src="https://placehold.co/600x400" alt="" class="wp-image-60" style="width:500px"/></figure>\n' +
					'<!-- /wp:image --> '
			);

			// Select target block
			cy.getBlock('core/image').click();

			// add alias to the feature container
			cy.getParentContainer('Width').as('widthContainer');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('500px').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@widthContainer').within(() => {
				cy.get('input').as('widthInput');
				cy.get('@widthInput').clear();
				cy.get('@widthInput').type('200', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('200px').to.be.equal(getSelectedBlock(data, 'width'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@widthContainer').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:image {"id":60,"sizeSlug":"full","linkDestination":"none","className":"is-resized"} -->\n' +
					'<figure class="wp-block-image size-full is-resized"><img src="https://placehold.co/600x400" alt="" class="wp-image-60"/></figure>\n' +
					'<!-- /wp:image --> '
			);

			// Select target block
			cy.getBlock('core/image').click();

			// add alias to the feature container
			cy.getParentContainer('Width').as('widthContainer');

			//
			// Test 1: Blockera dat to WP
			//

			// change value
			// only % is valid for WP
			cy.get('@widthContainer').within(() => {
				cy.get('input').as('widthInput');
				cy.get('@widthInput').type('300', { force: true });
				cy.get('select').select('px');
			});

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('300px').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			// only % is valid for WP
			cy.get('@widthContainer').within(() => {
				cy.get('input').as('widthInput');
				cy.get('@widthInput').clear();
				cy.get('@widthInput').type('200', { force: true });
				cy.get('select').select('%');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@widthContainer').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});
		});
	});

	describe('core/column Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:columns -->\n' +
					'<div class="wp-block-columns"><!-- wp:column {"width":"200px","style":{"color":{"background":"#d8d8d8"}}} -->\n' +
					'<div class="wp-block-column has-background" style="background-color:#d8d8d8;flex-basis:200px"><!-- wp:paragraph -->\n' +
					'<p>Paragraph inside column</p>\n' +
					'<!-- /wp:paragraph --></div>\n' +
					'<!-- /wp:column --></div>\n' +
					'<!-- /wp:columns -->'
			);

			// Select target block
			cy.getBlock('core/column').click();

			// switch to column block
			cy.get(
				'[aria-label="Select Column"], [aria-label="Select parent block: Column"]'
			).click();

			// add alias to the feature container
			cy.getParentContainer('Width').as('widthContainer');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('200px').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@widthContainer').within(() => {
				cy.get('input').as('widthInput');
				cy.get('@widthInput').clear();
				cy.get('@widthInput').type('300', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('300px').to.be.equal(getSelectedBlock(data, 'width'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@widthContainer').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:columns -->\n' +
					'<div class="wp-block-columns"><!-- wp:column {"width":"20%","style":{"color":{"background":"#d8d8d8"}}} -->\n' +
					'<div class="wp-block-column has-background" style="background-color:#d8d8d8;flex-basis:20%"><!-- wp:paragraph -->\n' +
					'<p>Paragraph inside column</p>\n' +
					'<!-- /wp:paragraph --></div>\n' +
					'<!-- /wp:column --></div>\n' +
					'<!-- /wp:columns -->'
			);

			// Select target block
			cy.getBlock('core/column').click();

			// switch to column block
			cy.get(
				'[aria-label="Select Column"], [aria-label="Select parent block: Column"]'
			).click();

			// add alias to the feature container
			cy.getParentContainer('Width').as('widthContainer');

			//
			// Test 1: Blockera dat to WP
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('20%').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@widthContainer').within(() => {
				cy.get('select').select('auto');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});
		});
	});

	describe('core/post-featured-image Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:post-featured-image {"aspectRatio":"auto","width":"200px"} /--> '
			);

			// Select target block
			cy.getBlock('core/post-featured-image').click();

			// add alias to the feature container
			cy.getParentContainer('Width').as('widthContainer');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('200px').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@widthContainer').within(() => {
				cy.get('input').as('widthInput');
				cy.get('@widthInput').clear();
				cy.get('@widthInput').type('300', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('300px').to.be.equal(getSelectedBlock(data, 'width'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@widthContainer').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:post-featured-image {"aspectRatio":"auto","width":"30%"} /--> '
			);

			// Select target block
			cy.getBlock('core/post-featured-image').click();

			// add alias to the feature container
			cy.getParentContainer('Width').as('widthContainer');

			//
			// Test 1: Blockera dat to WP
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('30%').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@widthContainer').within(() => {
				cy.get('select').select('auto');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));
			});
		});
	});
});
