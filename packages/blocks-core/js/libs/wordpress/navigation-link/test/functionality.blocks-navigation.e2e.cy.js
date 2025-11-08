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
	'Navigation Link Block',
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

		it('Functionality + Inner blocks', () => {
			appendBlocks('<!-- wp:navigation /-->');

			cy.getBlock('core/navigation').click();

			// Make sure the tree is visible (Ajax call done)
			cy.get('.block-editor-list-view-tree').should('be.visible');

			cy.get('.block-editor-list-view-tree').within(() => {
				// Open blocks menu
				cy.get('[aria-label="Add block"]')
					.first()
					.click({ force: true });
			});

			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('input[type="text"]').type('#test{enter}');
				});

			// switch to target block
			cy.getBlock('core/navigation-link').last().click({ force: true });

			cy.checkBlockCardItems(['normal', 'hover', 'current-menu-item']);

			cy.checkBlockStatesPickerItems([
				'states/current-menu-item',
				'states/current-menu-parent',
				'states/current-menu-ancestor',
				'states/active',
				'states/visited',
				'elements/link',
				'elements/bold',
				'elements/italic',
				'elements/kbd',
				'elements/code',
				'elements/span',
				'elements/mark',
				'elements/icon',
			]);

			// assert block card
			cy.get('.blockera-extension-block-card.master-block-card').should(
				'exist'
			);

			// switch to parent navigation button should be visible
			cy.get('.blockera-extension-block-card.master-block-card').within(
				() => {
					cy.get(
						'button[data-test="back-to-parent-navigation"]'
					).should('be.visible');
				}
			);

			// Icon extension is active
			cy.getByDataTest('settings-tab').click();
			cy.getByAriaLabel('Choose Icon…').should('be.visible');

			// switch back to style tab
			cy.getByDataTest('style-tab').click();

			//
			// 1. Inner blocks existence
			//
			openInserter();

			cy.getByDataTest('elements/link').should('exist');
			cy.getByDataTest('states/current-menu-item').should('exist');
			cy.getByDataTest('states/current-menu-parent').should('exist');
			cy.getByDataTest('states/current-menu-ancestor').should('exist');

			// no other item
			cy.getByDataTest('core/paragraph').should('not.exist');

			//
			// 2. Edit Block
			//

			//
			// 2.0. Block Styles
			//
			cy.getSelectedBlock()
				.last()
				.should('not.have.css', 'background-clip', 'padding-box');

			cy.getParentContainer('Clipping').within(() => {
				cy.customSelect('Clip to Padding');
			});

			cy.getSelectedBlock().should(
				'have.css',
				'background-clip',
				'padding-box'
			);

			//
			// 2.1. elements/link inner block
			//
			setInnerBlock('elements/link');

			cy.setColorControlValue('BG Color', 'ff0000');

			cy.getSelectedBlock()
				.last()
				.within(() => {
					cy.get('a').should(
						'have.css',
						'background-color',
						'rgb(255, 0, 0)'
					);
				});

			//
			// 3. Check settings tab
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
			// 4. Assert inner blocks selectors in front end
			//
			savePage();
			redirectToFrontPage();

			cy.get('.blockera-block.wp-block-navigation-link')
				.last()
				.should('have.css', 'background-clip', 'padding-box');

			cy.get('.blockera-block.wp-block-navigation-link')
				.last()
				.within(() => {
					cy.get('a').should(
						'have.css',
						'background-color',
						'rgb(255, 0, 0)'
					);
				});
		});
	}
);
