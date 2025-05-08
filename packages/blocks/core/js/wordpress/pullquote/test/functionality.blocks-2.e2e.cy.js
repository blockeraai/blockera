/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
	setParentBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Pullquote Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(`<!-- wp:pullquote -->
<figure class="wp-block-pullquote"><blockquote><p>Quote or not <a href="https://blockera.ai/">quote</a>?</p><cite>The Hero</cite></blockquote></figure>
<!-- /wp:pullquote -->`);

		// Select target block
		cy.getBlock('core/pullquote').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');
		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/pullquote').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/pullquote').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/citation
		//
		setInnerBlock('elements/citation');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/pullquote')
			.first()
			.within(() => {
				cy.get('cite')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/link
		//
		setParentBlock();
		setInnerBlock('elements/link');

		//
		// 1.2.1. Link color
		//
		cy.setColorControlValue('Text Color', '0000ff');

		cy.getBlock('core/pullquote')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should('have.css', 'color', 'rgb(0, 0, 255)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-pullquote').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-pullquote').within(() => {
			// elements/citation
			cy.get('cite')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/link
			cy.get('a').first().should('have.css', 'color', 'rgb(0, 0, 255)');
		});
	});
});
