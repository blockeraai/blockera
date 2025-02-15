/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Query Pagination Previous Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/query-pagination-previous').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block styles
		//

		cy.getBlock('core/query-pagination-previous').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/query-pagination-previous').should(
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

		cy.getBlock('core/query-pagination-previous')
			.first()
			.within(() => {
				cy.get('.wp-block-query-pagination-previous-arrow').should(
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

		// Click on next page to enable the previous button
		cy.get('a[href="?query-48-page=2"]').should('be.visible').click();

		cy.get('.blockera-block.wp-block-query-pagination-previous').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-query-pagination-previous').within(
			() => {
				cy.get('.wp-block-query-pagination-previous-arrow').should(
					'have.css',
					'background-color',
					'rgb(204, 204, 204)'
				);
			}
		);
	});
});
