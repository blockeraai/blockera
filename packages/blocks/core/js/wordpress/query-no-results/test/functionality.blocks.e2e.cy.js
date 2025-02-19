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

describe('Query No Results Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/query').click({ force: true });
		cy.getBlock('core/query-no-results').click({ force: true });

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByDataTest('elements/link').should('exist');

				// no other item
				cy.getByDataTest('core/heading').should('not.exist');
			}
		);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/query-no-results').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/query-no-results').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/link
		//
		setInnerBlock('elements/link');

		//
		// 1.1.1. Link color
		//
		cy.setColorControlValue('Text Color', '0000ff');

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-query-no-results').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-query-no-results').within(() => {
			// elements/link
			cy.get('a').first().should('have.css', 'color', 'rgb(0, 0, 255)');
		});
	});
});
