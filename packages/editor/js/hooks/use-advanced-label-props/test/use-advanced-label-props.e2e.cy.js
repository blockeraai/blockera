import {
	appendBlocks,
	createPost,
	// setInnerBlock,
	// setDeviceType,
} from '@blockera/dev-cypress/js/helpers';

function setFontSize(value) {
	// Alias
	cy.get('h2').contains('Typography').parent().parent().as('typo');

	// Assertion for master block attributes.
	cy.get('@typo').within(() => {
		cy.get('[aria-label="Size"]')
			.parent()
			.next()
			.within(() => {
				cy.get('input').type(value);
			});
	});
}

function getFontSizeLabelStyle(cssClass) {
	// Alias
	cy.get('h2').contains('Typography').parent().parent().as('typo');

	// Assertion for master block attributes.
	cy.get('@typo').within(() => {
		cy.get('[aria-label="Size"]').should('have.class', cssClass);
	});
}

describe('useAdvancedLabelProps Hook Testing ...', () => {
	beforeEach(() => {
		createPost();
	});

	it('should display changed value on Paragraph -> Normal -> Laptop', () => {
		appendBlocks(
			'<!-- wp:paragraph -->\n' +
				'<p>Test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.getBlock('core/paragraph').click();

		setFontSize(27);

		getFontSizeLabelStyle('changed-in-normal-state');
	});
});
