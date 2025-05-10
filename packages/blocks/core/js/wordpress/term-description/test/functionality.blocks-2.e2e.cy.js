/**
 * Blockera dependencies
 */
import {
	// savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	openInserter,
	// redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Term Description Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks('<!-- wp:term-description /-->');

		// Select target block
		cy.getBlock('core/term-description').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		openInserter();
		cy.getByDataTest('elements/link').should('exist');

		//
		// 1. Edit Block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/term-description').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/term-description').should(
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

		// Append a tag at the end of the element
		cy.getBlock('core/term-description').then(($el) => {
			$el.append('<a href="https://blockera.ai">Test Link</a>');
		});

		cy.getBlock('core/term-description').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});

		// It's very complicated to test this, because the block is not rendered in the front end on simple pages
	});
});
