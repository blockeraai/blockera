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

describe('Post Title Block', () => {
	beforeEach(() => {
		createPost({ postTitle: 'Test Post' });
	});

	it('Functionality + inner blocks', () => {
		appendBlocks('<!-- wp:post-title {"isLink":true} /--> ');

		// Select target block
		cy.getBlock('core/post-title').click();

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
		// 1.0. Block Styles
		//

		cy.getBlock('core/post-title').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-title').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/link
		//

		setInnerBlock('elements/link');

		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-title').within(() => {
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

		cy.get('.blockera-block.wp-block-post-title').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-post-title').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});
	});
});
