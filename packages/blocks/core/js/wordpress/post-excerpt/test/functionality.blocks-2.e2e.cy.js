/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	openInserter,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Excerpt Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks('<!-- wp:post-excerpt {"moreText":"Read More"} /--> ');

		// Select target block
		cy.getBlock('core/post-excerpt').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		openInserter();
		cy.getByDataTest('elements/link').should('exist');

		// no other item
		cy.getByDataTest('core/heading').should('not.exist');

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/post-excerpt').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-excerpt').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/link inner block
		//
		setInnerBlock('elements/link');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-excerpt').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.getByDataTest('settings-tab').click();

		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-tools-panel-header')
				.contains('Settings')
				.scrollIntoView()
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.wp-block-post-excerpt.blockera-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.wp-block-post-excerpt.blockera-block').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});
	});
});
