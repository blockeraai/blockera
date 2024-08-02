/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comments Pagination Numbers Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comments-pagination-numbers').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/numbers inner block
		//
		setInnerBlock('elements/numbers');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		cy.getBlock('core/comments-pagination-numbers')
			.first()
			.within(() => {
				cy.get('.page-numbers:not(.dots)').should(
					'have.css',
					'background-color',
					'rgb(204, 204, 204)'
				);
			});

		//
		// 1.2. elements/current inner block
		//
		setParentBlock();
		setInnerBlock('elements/current');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/comments-pagination-numbers')
			.first()
			.within(() => {
				cy.get('.page-numbers.current').should(
					'have.css',
					'background-color',
					'rgb(255, 32, 32)'
				);
			});

		//
		// 1.3. elements/dots inner block
		//
		setParentBlock();
		setInnerBlock('elements/dots');

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff4040');

		cy.getBlock('core/comments-pagination-numbers')
			.first()
			.within(() => {
				cy.get('.page-numbers.dots').should(
					'have.css',
					'background-color',
					'rgb(255, 64, 64)'
				);
			});
	});
});
