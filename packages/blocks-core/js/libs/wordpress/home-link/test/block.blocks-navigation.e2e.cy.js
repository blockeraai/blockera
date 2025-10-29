/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	openInserter,
	setInnerBlock,
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

			// click on add block button
			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('button').contains('Add block').click();
				});

			// open block inserter
			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('button').contains('Browse all').click();
				});

			// switch to target block
			// cy.getBlock('core/home-link').last().click({ force: true });
			cy.get('.block-editor-block-types-list__list-item')
				.contains('Home Link')
				.click();

			// Block supported is active
			cy.get('.blockera-extension-block-card').should('be.visible');

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
