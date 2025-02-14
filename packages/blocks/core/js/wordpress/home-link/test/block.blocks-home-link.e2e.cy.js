/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	openInnerBlocksExtension,
	setInnerBlock,
	savePage,
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

		it('Functionality + Inner blocks', () => {
			appendBlocks('<!-- wp:navigation /-->');

			cy.getBlock('core/navigation').click();

			// Make sure the tree is visible (Ajax call done)
			cy.get('.block-editor-list-view-tree').should('be.visible');

			cy.get('.block-editor-list-view-tree').within(() => {
				// Open blocks menu
				cy.get('[aria-label="Add block"]').first().click();
			});

			// search for home link
			cy.get('.block-editor-inserter__popover input[type="search"]').type(
				'Home Link'
			);

			// insert
			cy.get('button.editor-block-list-item-home-link').last().click();

			// switch to target block
			cy.getBlock('core/home-link').last().click();

			// Block supported is active
			cy.get('.blockera-extension-block-card').should('be.visible');

			// Has inner blocks
			cy.get(
				'.blockera-extension.blockera-extension-inner-blocks'
			).should('exist');

			//
			// 1. Inner blocks existence
			//

			// open inner block settings
			openInnerBlocksExtension();

			cy.get(
				'.blockera-extension.blockera-extension-inner-blocks'
			).within(() => {
				cy.getByDataTest('elements/link').should('exist');

				// no other item
				cy.getByDataTest('core/paragraph').should('not.exist');
			});

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

		it('Block should be supported + switch to parent should work', () => {
			appendBlocks('<!-- wp:navigation /-->');

			cy.getBlock('core/navigation').click();

			// Make sure the tree is visible (Ajax call done)
			cy.get('.block-editor-list-view-tree').should('be.visible');

			cy.get('.block-editor-list-view-tree').within(() => {
				// Open blocks menu
				cy.get('[aria-label="Add block"]').first().click();
			});

			// search for home link
			cy.get('.block-editor-inserter__popover input[type="search"]').type(
				'Home Link'
			);

			// insert
			cy.get('button.editor-block-list-item-home-link').last().click();

			// switch to target block
			cy.getBlock('core/home-link').first().click();

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
	}
);
