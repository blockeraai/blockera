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

describe('Query Pagination Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/query-pagination-numbers').click();

		// Switch to parent block
		cy.getByAriaLabel('Select Pagination').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.getByDataTest('elements/link').should('exist');

		// no other item
		cy.getByDataTest('core/heading').should('not.exist');

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/query-pagination').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/query-pagination').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/link
		//

		setInnerBlock('elements/link');

		cy.setColorControlValue('Text Color', '0000ff');

		cy.getBlock('core/query-pagination').within(() => {
			cy.get('a').first().should('have.css', 'color', 'rgb(0, 0, 255)');
		});

		// 1.2. elements/link
		//
		// 2. Assert inner blocks selectors in front end
		//

		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-query-pagination').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-query-pagination').within(() => {
			cy.get('a').first().should('have.css', 'color', 'rgb(0, 0, 255)');
		});
	});
});
