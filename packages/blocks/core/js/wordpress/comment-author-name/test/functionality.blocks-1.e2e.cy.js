/**
 * Blockera dependencies
 */
import {
	savePage,
	editPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comment Author Name Block', () => {
	beforeEach(() => {
		editPost({ postID: 1 });
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comment-author-name').first().click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');
		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/comment-author-name').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

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
		// 2. Check settings tab
		//
		setParentBlock();
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
