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
	openBlockInserter,
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
			openBlockInserter();
			appendBlocks('<!-- wp:navigation /-->');

			cy.getBlock('core/navigation').click();

			// Make sure the tree is visible (Ajax call done)
			cy.get('.block-editor-list-view-tree').should('be.visible');

			cy.get('.block-editor-list-view-tree')
				.last()
				.within(() => {
					// Open blocks menu
					cy.get('[aria-label="Add page"]')
						.first()
						.click({ force: true });
				});

			// wait to open popover
			cy.wait(100);

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

			// Close inserter
			cy.getByDataTest('add-new-block-state').click();

			// Icon extension is active
			cy.getByAriaControls('settings-view').click({ force: true });
			cy.getByAriaLabel('Choose Icon…').should('exist');

			// switch back to style tab
			cy.getByAriaControls('styles-view').click();

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
			// 3. Assert inner blocks selectors in front end
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
