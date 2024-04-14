/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Verse Block → Inner Blocks', () => {
	it('Should add all inner blocks to block settings', () => {
		appendBlocks(
			'<!-- wp:verse -->\n' +
				'<pre class="wp-block-verse">It\'s the verse...</pre>\n' +
				'<!-- /wp:verse -->'
		);

		// Select target block
		cy.getBlock('core/verse').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.publisher-extension.publisher-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Links Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});
