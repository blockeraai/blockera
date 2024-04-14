/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Columns Block → Inner Blocks', () => {
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

		cy.get('.publisher-extension.publisher-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Link Customize').should('exist');
				cy.getByAriaLabel('Button Customize').should('exist');

				cy.getByAriaLabel('Headings Customize').should('not.exist');
				cy.getByAriaLabel('H1s Customize').should('not.exist');
			}
		);
	});
});
