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

describe('Post Author Name Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks('<!-- wp:post-author-name {"isLink":true} /--> ');

		// Select target block
		cy.getBlock('core/post-author-name').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

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
		cy.getBlock('core/post-author-name').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-author-name').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/link
		//
		setInnerBlock('elements/link');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		cy.getBlock('core/post-author-name').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
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

		cy.get('.blockera-block.wp-block-post-author-name').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-post-author-name').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});
	});
});
