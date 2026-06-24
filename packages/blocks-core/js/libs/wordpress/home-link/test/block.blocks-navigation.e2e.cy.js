/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	openInserter,
	setInnerBlock,
	openBlockInserter,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe(
	'Home Link Block',
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

			// click on add block button
			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('button').contains('Add block').click();
				});

			// wait to open popover
			cy.wait(100);

			// open block inserter
			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('button').contains('Browse all').click();
				});

			// wait to open popover
			cy.wait(100);

			// switch to target block
			// cy.getBlock('core/home-link').last().click({ force: true });
			cy.get('.block-editor-block-types-list__list-item')
				.contains('Home Link')
				.click();

			// Block supported is active
			cy.get('.blockera-extension-block-card').should('be.visible');

			cy.checkBlockStatesPickerItems([
				'states/current-menu-item',
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

			// switch to parent navigation button should be visible
			cy.get('.blockera-extension-block-card.master-block-card').within(
				() => {
					cy.get(
						'button[data-test="back-to-parent-navigation"]'
					).should('be.visible');
				}
			);

			// Icon extension is active
			cy.getByAriaControls('settings-view').click({ force: true });
			cy.getByAriaLabel('Choose Icon…').should('be.visible');

			// switch back to style tab
			cy.getByAriaControls('styles-view').click();

			//
			// 1. Inner blocks existence
			//

			cy.checkBlockCardItems(['normal', 'hover', 'current-menu-item']);

			openInserter();
			cy.getByDataTest('elements/link').should('exist');

			// no other item
			cy.getByDataTest('core/paragraph').should('not.exist');

			//
			// 1. Edit Block
			//

			//
			// 1.0. Block Styles
			//
			cy.getBlock('core/home-link')
				.last()
				.should('not.have.css', 'background-clip', 'padding-box');

			cy.getParentContainer('Clipping').within(() => {
				cy.customSelect('Clip to Padding');
			});

			cy.getBlock('core/home-link')
				.last()
				.should('have.css', 'background-clip', 'padding-box');

			//
			// 1.1. Inner blocks
			//
			setInnerBlock('elements/link');

			cy.setColorControlValue('BG Color', 'ff0000');

			cy.getBlock('core/home-link')
				.last()
				.within(() => {
					cy.get('a').should(
						'have.css',
						'background-color',
						'rgb(255, 0, 0)'
					);
				});

			//
			// 2. Assert inner blocks selectors in front end
			//
			savePage();
			redirectToFrontPage();

			cy.get('.blockera-block.wp-block-home-link')
				.last()
				.should('have.css', 'background-clip', 'padding-box');

			cy.get('.blockera-block.wp-block-home-link')
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
