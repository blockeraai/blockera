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

describe(
	'Navigation Block',
	{
		defaultCommandTimeout: 50000,
	},
	() => {
		beforeEach(() => {
			createPost();
		});

		afterEach(() => {
			cy.window().then((win) => {
				win.stop();
			});
		});

		it('Functionality + inner blocks', () => {
			appendBlocks(`<!-- wp:navigation -->
<!-- wp:navigation-link {"label":"Top","url":"#top-level-link"} /-->
<!-- wp:navigation-submenu {"label":"Sub","url":"#submenu-parent"} -->
<!-- wp:navigation-link {"label":"Child","url":"#submenu-child-item"} /-->
<!-- /wp:navigation-submenu -->
<!-- /wp:navigation -->
`);

			cy.getBlock('core/navigation').click();

			cy.get('.blockera-extension-block-card').should('be.visible');

			cy.checkBlockCardItems(['normal', 'hover', 'elements/link-items']);

			openInserter();
			cy.getByDataTest('elements/link-items').should('exist');
			cy.getByDataTest('core/paragraph').should('not.exist');

			//
			// 1. elements/link-items (top-level only)
			//
			setInnerBlock('elements/link-items');

			cy.checkBlockCardItems(
				['normal', 'hover', 'focus', 'current-menu-item'],
				true
			);

			openInserter();
			cy.getByDataTest('states/current-menu-item').should('exist');
			cy.getByDataTest('states/current-menu-parent').should('exist');
			cy.getByDataTest('states/current-menu-ancestor').should('exist');
			cy.getByDataTest('states/active').should('exist');
			cy.getByDataTest('states/visited').should('exist');

			cy.setColorControlValue('BG Color', 'ff0000');

			cy.getBlock('core/navigation').within(() => {
				cy.get(
					':is(.wp-block-navigation__container, .wp-block-page-list) > .wp-block-navigation-item'
				)
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');

				cy.get(
					'.wp-block-navigation__submenu-container .wp-block-navigation-item'
				)
					.first()
					.should(
						'not.have.css',
						'background-color',
						'rgb(255, 0, 0)'
					);
			});

			//
			// 2. Master block styles
			//
			setParentBlock();

			cy.getBlock('core/navigation')
				.first()
				.should('not.have.css', 'background-clip', 'padding-box');

			cy.getParentContainer('Clipping').within(() => {
				cy.customSelect('Clip to Padding');
			});

			cy.getBlock('core/navigation')
				.first()
				.should('have.css', 'background-clip', 'padding-box');

			//
			// 3. Settings tab
			//
			cy.getBlock('core/navigation').click();
			cy.get('[role="tab"][aria-label="Settings"]').click();

			cy.get('.block-editor-block-inspector').within(() => {
				cy.get(
					'.components-tools-panel:not(.block-editor-bindings__panel)'
				)
					.should('exist')
					.should('be.visible');
			});

			//
			// 4. Front end — general block support only
			//
			savePage();
			redirectToFrontPage();

			cy.get('.blockera-block.wp-block-navigation')
				.first()
				.should('have.css', 'background-clip', 'padding-box');
		});
	}
);
