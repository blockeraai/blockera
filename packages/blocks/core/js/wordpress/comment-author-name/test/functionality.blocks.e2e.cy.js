/**
 * Blockera dependencies
 */
import {
	editPost,
	appendBlocks,
	savePage,
	redirectToFrontPage,
	setInnerBlock,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comment Author Name Block → Functionality + Inner blocks', () => {
	beforeEach(() => {
		editPost({ postID: 1 });
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comment-author-name').first().click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		//
		// 1.0. Block Styles
		//
		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/comment-author-name').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. Inner blocks
		//
		setInnerBlock('elements/link');

		cy.setColorControlValue('BG Color', 'ffdbdb');

		cy.getBlock('core/comment-author-name')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(255, 219, 219)'
					);
			});

		//
		// 2. Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-comment-author-name').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-comment-author-name')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(255, 219, 219)'
					);
			});
	});
});
