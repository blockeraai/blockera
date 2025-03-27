/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('Verse Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:verse -->
<pre class="wp-block-verse">It\'s the verse with <a href="https://blockera.ai">link</a>...</pre>
<!-- /wp:verse -->`);

		// Select target block
		cy.getBlock('core/verse').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByDataTest('elements/link').should('exist');

				// no other item
				cy.getByDataTest('core/heading').should('not.exist');
			}
		);

		//
		// 1. Edit Block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/verse').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/verse').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.2. elements/link
		//
		setInnerBlock('elements/link');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/verse').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-verse').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-verse').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});
	});
});
