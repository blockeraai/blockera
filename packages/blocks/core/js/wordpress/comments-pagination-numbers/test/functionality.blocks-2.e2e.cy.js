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

describe('Comments Pagination Numbers Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comments-pagination-numbers').click();

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
		// 1.0. Block Styles
		//
		cy.getBlock('core/comments-pagination-numbers').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/comments-pagination-numbers').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

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

		// todo we can not assert front end here, because we do not have enough comments on CI and needs to be fixed to test this
	});
});
