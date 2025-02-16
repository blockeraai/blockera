/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	createTerm,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
	setCategoriesByID,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Terms Block', () => {
	beforeEach(() => {
		//
		// Setup terms
		//
		createTerm('Category 1');
		createTerm('Category 2');

		//
		// Create post
		//
		createPost();

		//
		// Set categories by slug
		// The 2 and 3 are the IDs of the categories created above or available currently
		// the IDs are not important here, we just need to make sure some categories are set
		//
		setCategoriesByID([2, 3]);
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(
			'<!-- wp:post-terms {"term":"category","prefix":"prefix text","suffix":"suffix text"} /-->'
		);

		// Select target block
		cy.getBlock('core/post-terms').click();

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

		cy.getBlock('core/post-terms').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-terms').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/separator
		//
		setInnerBlock('elements/separator');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		// there is an issue that blocks are not updated immediately to see the terms
		// so we check the separator color in the front end

		//
		// 1.2. elements/prefix
		//
		setParentBlock();
		setInnerBlock('elements/prefix');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-terms')
			.first()
			.within(() => {
				cy.get('.wp-block-post-terms__prefix')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.3. elements/suffix
		//
		setParentBlock();
		setInnerBlock('elements/suffix');

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-terms')
			.first()
			.within(() => {
				cy.get('.wp-block-post-terms__suffix')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-post-terms').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-post-terms').within(() => {
			// core/separator
			cy.get('.wp-block-post-terms__separator')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/prefix
			cy.get('.wp-block-post-terms__prefix')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/suffix
			cy.get('.wp-block-post-terms__suffix')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});
