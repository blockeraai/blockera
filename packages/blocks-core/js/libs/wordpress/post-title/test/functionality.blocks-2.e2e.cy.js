/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	openInserter,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Title Block', () => {
	beforeEach(() => {
		createPost({ postTitle: 'Test Post' });
	});

	it('Functionality + inner blocks', () => {
		appendBlocks('<!-- wp:post-title {"isLink":true} /--> ');

		// Select target block
		cy.getBlock('core/post-title').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		openInserter();
		cy.getByDataTest('elements/link').should('exist');
		cy.getByDataTest('core/heading').should('not.exist');

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/post-title').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-title').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/link
		//

		setInnerBlock('elements/link');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-title').within(() => {
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

		cy.get('.blockera-block.wp-block-post-title').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-post-title').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});
	});
});
