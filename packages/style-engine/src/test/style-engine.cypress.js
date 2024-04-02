import {
	appendBlocks,
	getBlockClientId,
	getWPDataObject,
} from '../../../../cypress/helpers';

//// Switch to normal state.
// 		cy.get('[data-id="normal"]').click();

describe('getCssSelector() Testing ...', () => {
	beforeEach(() => {
		appendBlocks(
			'<!-- wp:paragraph -->\n' + '<p></p>\n' + '<!-- /wp:paragraph -->'
		);
	});

	it('should generate css for: Paragraph -> Normal -> Laptop state', () => {
		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		cy.setInputFieldValue('Width', 'Size', 100);

		getWPDataObject().then((data) => {
			cy.get(`#block-${getBlockClientId(data)}`).should(
				'have.css',
				'width',
				'100px'
			);
		});
	});
	it.only('should generate css for: Paragraph -> Hover -> Laptop state', () => {
		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		// Add Hover state
		cy.getByAriaLabel('Add New State').click();

		cy.setInputFieldValue('Width', 'Size', 100);

		getWPDataObject().then((data) => {
			cy.get(`#block-${getBlockClientId(data)}`).should(
				'have.css',
				'width',
				'100px'
			);
		});
	});
});
