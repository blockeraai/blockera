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

		cy.checkBlockCardItems(['normal', 'hover', 'elements/link']);

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

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/latest-posts').within(() => {
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
			['Post content', 'Post meta'].forEach((item) => {
				cy.get('.components-tools-panel-header')
					.contains(item)
					.scrollIntoView()
					.should('be.visible');
			});

			['Featured image', 'Sorting and filtering'].forEach((item) => {
				cy.get('.components-panel__body-title button')
					.contains(item)
					.scrollIntoView()
					.should('be.visible');
			});
		});

		//
		// 3. Assert inner blocks selectors in front end
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
