/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	setInnerBlock,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comments Pagination Block → Functionality + Inner blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comments-pagination').click();

		cy.getByAriaLabel('Select parent block: Comments Pagination').click();

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

		cy.getBlock('core/comments-pagination').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. Inner blocks
		//
		setInnerBlock('elements/link');

		cy.setColorControlValue('BG Color', 'eeeeee');

		cy.getBlock('core/comments-pagination')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(238, 238, 238)'
					);
			});

		// todo we can not assert front end here, because we do not have enough comments on CI and needs to be fixed to test this
	});
});
