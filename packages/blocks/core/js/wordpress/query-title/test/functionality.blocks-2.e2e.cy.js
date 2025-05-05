/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	setInnerBlock,
	// savePage,
	// redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Query Title Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks('<!-- wp:query-title {"type":"search"} /--> ');

		// Select target block
		cy.getBlock('core/query-title').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.getByDataTest('elements/link').should('exist');

		// no other item
		cy.getByDataTest('core/heading').should('not.exist');

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block styles
		//

		cy.getBlock('core/query-title').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/query-title').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. Link inner block
		//
		setInnerBlock('elements/link');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		// Append a tag at the end of the element
		cy.getBlock('core/query-title').then(($el) => {
			$el.append('<a href="https://blockera.ai">Test Link</a>');
		});

		cy.getBlock('core/query-title').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});

		//
		// 2. Assert inner blocks selectors in front end
		//

		// it's very complicated to test this, because the block is not rendered in the front end
	});
});
