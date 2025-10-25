/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	openInserter,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Comments Link Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks('<!-- wp:post-comments-link /--> ');

		// Select target block
		cy.getBlock('core/post-comments-link').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover', 'elements/link']);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/post-comments-link').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-comments-link').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/link
		//
		setInnerBlock('elements/link');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		cy.getBlock('core/post-comments-link').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-post-comments-link').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-post-comments-link').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});
	});
});
