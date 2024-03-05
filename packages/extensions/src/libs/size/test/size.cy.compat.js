/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

describe('Tests for Size Extension compatibility with WordPress core blocks attributes', () => {
	it('should sets "publisherWidth" value From wp "width" and on the contrary', () => {
		appendBlocks(
			'\n' +
				'<!-- wp:buttons -->\n' +
				'<div class="wp-block-buttons"><!-- wp:button {"width":50} /--></div>\n' +
				'<!-- /wp:buttons -->'
		);

		// Select target block
		cy.get('[data-type="core/button"]').click();

		// From wp
		getWPDataObject().then((data) => {
			expect('50%').to.be.equal(getSelectedBlock(data, 'publisherWidth'));
		});

		// Type in ours width control
		cy.getByAriaLabel('Input Width').clear();
		cy.getByAriaLabel('Input Width').type(300, { force: true });

		// To wp
		getWPDataObject().then((data) => {
			expect(300).to.be.equal(getSelectedBlock(data, 'width'));
		});
	});
});
