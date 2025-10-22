/**
 * Blockera dependencies
 */
import {
	savePage,
	editPost,
	selectBlock,
	appendBlocks,
	openBlockNavigator,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comment Template Block', () => {
	beforeEach(() => {
		editPost({ postID: 1 });
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(testContent + ' comment template block ' + Math.random());

		// Select target block
		cy.getBlock('core/comment-template').first().click();

		// Open block navigator
		openBlockNavigator();

		// Select target block
		selectBlock('Comment Template');

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/comment-template').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/comment-template').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-comment-template').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
