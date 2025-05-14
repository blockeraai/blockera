/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Author Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks('<!-- wp:post-author {"byline":"Author"} /--> ');

		// Select target block
		cy.getBlock('core/post-author').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');
		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/post-author').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-author').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. core/avatar inner block
		//
		setInnerBlock('core/avatar');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-author')
			.first()
			.within(() => {
				cy.get('.wp-block-post-author__avatar > img')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/byline inner block
		//
		setParentBlock();
		setInnerBlock('elements/byline');

		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-author')
			.first()
			.within(() => {
				cy.get('.wp-block-post-author__byline')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.3. elements/author inner block
		//
		setParentBlock();
		setInnerBlock('elements/author');

		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-author')
			.first()
			.within(() => {
				cy.get('.wp-block-post-author__name')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.getByDataTest('settings-tab').click();

		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-panel__body-title button')
				.contains('Settings')
				.scrollIntoView()
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-post-author').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-post-author').within(() => {
			// core/avatar inner block
			cy.get('.wp-block-post-author__avatar > img')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/byline inner block
			cy.get('.wp-block-post-author__byline')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/byline inner block
			cy.get('.wp-block-post-author__name')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});
