/**
 * Blockera dependencies
 */
import {
	savePage,
	editPost,
	appendBlocks,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comments Title Block', () => {
	beforeEach(() => {
		editPost({ postID: 1 });
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(testContent + ' comment title block ' + Math.random());

		// Select target block
		cy.getBlock('core/comments-title').first().click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// No inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/comments-title').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/comments-title').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Check settings tab
		//
		cy.getByDataTest('settings-tab').click();

		// layout settings should be hidden
		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-panel__body-title button')
				.contains('Settings')
				.should('be.visible');
		});

		//
		// 3. Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-comments-title').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
