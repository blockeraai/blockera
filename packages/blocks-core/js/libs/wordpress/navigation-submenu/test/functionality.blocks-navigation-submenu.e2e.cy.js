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
	'Navigation Submenu Block',
	{
		defaultCommandTimeout: 50000,
	},
	() => {
		beforeEach(() => {
			createPost();
		});

		afterEach(() => {
			// to prevent any pending requests from interfering with the next test
			cy.window().then((win) => {
				win.stop();
			});
		});

		it('Block should be supported + switch to parent should work', () => {
			appendBlocks('<!-- wp:navigation /-->');

			cy.getBlock('core/navigation').click();

			// Make sure the tree is visible (Ajax call done)
			cy.get('.block-editor-list-view-tree').should('be.visible');

			cy.get('.block-editor-list-view-tree').within(() => {
				// Open blocks menu
				cy.get('[aria-label="Add block"]').first().click();
			});

			// search for Submenu
			cy.get('.block-editor-inserter__popover input[type="search"]').type(
				'Submenu'
			);

			// insert
			cy.get('button.editor-block-list-item-navigation-submenu')
				.last()
				.click();

			// enter link value
			cy.get('input[type="text"]:focus').type('#test{enter}');

			// switch to target block
			cy.getBlock('core/navigation-submenu')
				.last()
				.click({ force: true });

			// assert block card
			cy.get('.blockera-extension-block-card.master-block-card').should(
				'exist'
			);

			// switch to parent navigation block
			cy.get('.blockera-extension-block-card.master-block-card').within(
				() => {
					cy.get(
						'button[data-test="back-to-parent-navigation"]'
					).should('exist');
					cy.get(
						'button[data-test="back-to-parent-navigation"]'
					).click();
				}
			);

			//
			// Assert block switched to parent navigation block
			//
			cy.get('.blockera-extension-block-card.master-block-card').should(
				'not.exist'
			);
			cy.get('.block-editor-block-card').should('exist');
			cy.get('.block-editor-block-card').within(() => {
				cy.get('.block-editor-block-card__title').contains(
					'Navigation'
				);
			});
		});

		it('Functionality + Inner blocks', () => {
			appendBlocks('<!-- wp:navigation /-->');

			cy.getBlock('core/navigation').click();

			cy.get('.block-editor-list-view-tree').should('be.visible');

			cy.get('.block-editor-list-view-tree').within(() => {
				// Open blocks menu
				cy.get('[aria-label="Add block"]').first().click();
			});

			// search for Submenu
			cy.get('.block-editor-inserter__popover input[type="search"]').type(
				'Submenu'
			);

			// insert
			cy.get('button.editor-block-list-item-navigation-submenu')
				.last()
				.click();

			// enter link value
			cy.get('input[type="text"]:focus').type('#test{enter}');

			// switch to target block
			cy.getBlock('core/navigation-submenu')
				.last()
				.click({ force: true });

			// add submenu items
			cy.getBlock('core/navigation-submenu')
				.last()
				.within(() => {
					cy.get('.block-editor-button-block-appender').click();
				});

			// enter link value
			cy.get('input[type="text"]:focus').type('#custom-test{enter}');

			// Switch back to submenu block
			cy.getBlock('core/navigation-submenu')
				.last()
				.click({ force: true });
			cy.getByAriaLabel('Select Submenu').click();

			//
			// 0. Inner blocks existence
			//
			cy.checkBlockCardItems([
				'normal',
				'hover',
				'current-menu-item',
				'elements/link',
				'elements/submenu-icon',
				'elements/submenu-container',
				'elements/submenu-items',
			]);

			openInserter();
			cy.getByDataTest('elements/link').should('exist');
			cy.getByDataTest('states/current-menu-item').should('exist');
			cy.getByDataTest('states/current-menu-parent').should('exist');
			cy.getByDataTest('states/current-menu-ancestor').should('exist');

			// no other item
			cy.getByDataTest('core/paragraph').should('not.exist');

			//
			// 1. Edit Block
			//
			cy.getSelectedBlock()
				.last()
				.should('not.have.css', 'background-clip', 'padding-box');

			cy.getParentContainer('Clipping').within(() => {
				cy.customSelect('Clip to Padding');
			});

			cy.getSelectedBlock()
				.last()
				.should('have.css', 'background-clip', 'padding-box');

			//
			// 1.1. elements/link
			//
			setInnerBlock('elements/link');

			cy.checkBlockCardItems(
				['normal', 'hover', 'focus', 'active'],
				true
			);

			//
			// 1.2. elements/submenu-icon
			//
			setInnerBlock('elements/submenu-icon');

			cy.checkBlockCardItems(['normal', 'hover'], true);

			//
			// 1.3. elements/submenu-container
			//
			setInnerBlock('elements/submenu-container');

			cy.checkBlockCardItems(['normal', 'hover'], true);

			//
			// 1.3.1. BG color
			//
			cy.setColorControlValue('BG Color', 'cccccc');

			cy.getSelectedBlock().within(() => {
				cy.get('.wp-block-navigation__submenu-container').should(
					'have.css',
					'background-color',
					'rgb(204, 204, 204)'
				);
			});

			//
			// 1.4. elements/submenu-items
			//
			setInnerBlock('elements/submenu-items');

			cy.checkBlockCardItems(
				['normal', 'hover', 'current-menu-item'],
				true
			);

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
			// 3. Assert front end
			//
			savePage();
			redirectToFrontPage();

			cy.get(
				'.entry-content li.blockera-block.wp-block-navigation-submenu'
			)
				.last()
				.should('have.css', 'background-clip', 'padding-box');

			cy.get(
				'.entry-content li.blockera-block.wp-block-navigation-submenu > ul'
			).should('have.css', 'background-color', 'rgb(204, 204, 204)');
		});
	}
);
