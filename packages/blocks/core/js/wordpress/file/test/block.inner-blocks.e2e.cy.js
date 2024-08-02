/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('File Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(
			'<!-- wp:file {"id":80,"href":"https://placehold.co/600x400"} -->\n' +
				'<div class="wp-block-file"><a id="wp-block-file--media-d6522e7b-18b5-44ed-9925-aa94af2be7e3" href="https://placehold.co/600x400">about-sofia</a><a href="https://placehold.co/600x400" class="wp-block-file__button wp-element-button" download aria-describedby="wp-block-file--media-d6522e7b-18b5-44ed-9925-aa94af2be7e3">Download</a></div>\n' +
				'<!-- /wp:file --> '
		);

		// Select target block
		cy.getBlock('core/file').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByDataTest('elements/link').should('exist');
				cy.getByDataTest('core/button').should('exist');

				// no other item
				cy.getByDataTest('core/heading').should('not.exist');
			}
		);
	});
});
