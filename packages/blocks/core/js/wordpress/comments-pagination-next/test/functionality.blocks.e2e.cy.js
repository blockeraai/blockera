/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	setInnerBlock,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comments Pagination Next Block → Functionality + Inner blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comments-pagination-next').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.0. Block Styles
		//
		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/comments-pagination-next').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. Arrow inner block
		//
		setInnerBlock('elements/arrow');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		cy.getBlock('core/comments-pagination-next')
			.first()
			.within(() => {
				cy.get('.wp-block-comments-pagination-next-arrow').should(
					'have.css',
					'background-color',
					'rgb(204, 204, 204)'
				);
			});

		// todo we can not assert front end here, because we do not have enough comments on CI and needs to be fixed to test this
	});
});
