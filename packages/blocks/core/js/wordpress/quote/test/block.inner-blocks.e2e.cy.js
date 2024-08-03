/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Quote Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors in block editor and front-end', () => {
		appendBlocks(
			'<!-- wp:quote -->\n' +
				'<blockquote class="wp-block-quote"><!-- wp:paragraph -->\n' +
				'<p>text here</p>\n' +
				'<!-- /wp:paragraph --><cite>my name</cite></blockquote>\n' +
				'<!-- /wp:quote -->'
		);

		// Select target block
		cy.getBlock('core/paragraph').click();

		// Switch to parent block
		cy.getByAriaLabel('Select Quote').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/citation
		//
		setInnerBlock('elements/citation');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/quote')
			.first()
			.within(() => {
				cy.get('cite')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').within(() => {
			// elements/citation
			cy.get('cite')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});
