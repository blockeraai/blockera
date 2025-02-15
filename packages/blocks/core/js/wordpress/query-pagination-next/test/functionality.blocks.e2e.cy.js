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

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Query Pagination Next Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/query-pagination-next').click();

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

		cy.getBlock('core/query-pagination-next').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/query-pagination-next').should(
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

		cy.getBlock('core/query-pagination-next')
			.first()
			.within(() => {
				cy.get('.wp-block-query-pagination-next-arrow').should(
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

		cy.get('.blockera-block.wp-block-query-pagination-next').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-query-pagination-next').within(() => {
			cy.get('.wp-block-query-pagination-next-arrow').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});
	});
});
