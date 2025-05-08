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

describe('Quote Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(`<!-- wp:quote -->
<blockquote class="wp-block-quote">
<!-- wp:paragraph -->
<p>text here with a <a href="https://blockera.ai">link</a></p>
<!-- /wp:paragraph -->
<cite>my name</cite>
</blockquote>
<!-- /wp:quote -->`);

		// Select target block
		cy.getBlock('core/paragraph').click();

		// Switch to parent block
		cy.getByAriaLabel('Select Quote').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');
		//
		// 1. Edit Block
		//

		//
		// 1.0. Block styles
		//

		cy.getBlock('core/quote').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/quote').should(
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

		cy.getBlock('core/quote')
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
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', '00ff00');

		cy.getBlock('core/quote')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should('have.css', 'background-color', 'rgb(0, 255, 0)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-quote').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2.1. elements/citation
		//
		cy.get('.blockera-block.wp-block-quote').within(() => {
			// elements/citation
			cy.get('cite')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});

		//
		// 2.2. elements/link
		//
		cy.get('.blockera-block.wp-block-quote').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(0, 255, 0)'
			);
		});
	});
});
