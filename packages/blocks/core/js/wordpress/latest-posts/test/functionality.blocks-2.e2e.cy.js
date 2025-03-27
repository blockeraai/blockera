/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	setInnerBlock,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Latest Posts Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks('<!-- wp:latest-posts /--> \n');

		// Select target block
		cy.getBlock('core/latest-posts').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		//
		// 1. Edit Blocks
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/latest-posts').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/latest-posts').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. Inner blocks
		//
		setInnerBlock('elements/link');

		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/latest-posts').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-latest-posts').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-latest-posts').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});
	});
});
