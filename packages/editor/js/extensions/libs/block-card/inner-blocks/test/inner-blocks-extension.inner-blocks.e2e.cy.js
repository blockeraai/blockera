/**
 * Blockera dependencies
 */
import {
	search,
	createPost,
	appendBlocks,
	openInserter,
	reSelectBlock,
	getWPDataObject,
	getSelectedBlock,
	getAllowedBlocks,
	getBlockTypeInnerBlocksStore,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Testing inner blocks functionalities.
 *
 * We're testing inner blocks extension repeater control where includes below contexts:
 * 1- Display in UI forces block types by default.
 * 2- Add or Pick inner block type from inserter block type.
 * 3- Check inserted picked block type in repeater control.
 * 4- Check the list of allowed block types for current selected block.
 * 5- Search bar component.
 * 6- Value cleanup.
 * 7- store api.
 * 8- control context provider.
 */
describe('Inner Blocks Functionality Tests ...', () => {
	beforeEach(() => {
		createPost();
	});

	describe('forces block types', () => {
		it('should exists forces inner block types in group selected block and added "core/buttons" block', () => {
			context(
				'appending group block and select it and open inner blocks extension component',
				() => {
					appendBlocks(
						`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"></div>
<!-- /wp:group -->`
					);

					cy.getIframeBody()
						.find(
							'[aria-label="Group: Gather blocks in a container."]'
						)
						.click();
				}
			);

			context(
				'Checking forces items, and inserter items count with searching "buttons" block type to select that',
				() => {
					cy.getByDataTest('core/paragraph').should('exist');
					cy.getByDataTest('core/button').should('exist');
					cy.getByDataTest('core/heading').should('exist');

					cy.getByDataTest('elements/link').should('not.exist');
					openInserter();
					cy.getByDataTest('elements/link').should('exist');

					// Checking opened inserter block types.
					cy.getByDataTest('popover-body')
						.should('exist')
						.within(() => {
							cy.get('.blockera-feature-type').should(
								'have.length',
								75
							);

							// Searching verse block type.
							search('verse');

							cy.get('.blockera-feature-type').should(
								'have.length',
								1
							);

							cy.getByAriaLabel('core/verse').click({
								force: true,
							});
						});
				}
			);

			context(
				'Rechecking forces items, and inserter items count with reselect current block editing ui',
				() => {
					// Reselect block.
					reSelectBlock('core/group');

					cy.getByDataTest('core/paragraph').should('exist');
					cy.getByDataTest('core/button').should('exist');
					cy.getByDataTest('core/heading').should('exist');
					cy.getByDataTest('core/verse').should('exist');

					cy.getByDataTest('elements/link').should('not.exist');
					openInserter();
					cy.getByDataTest('elements/link').should('exist');

					// Checking opened inserter block types.
					cy.getByDataTest('popover-body')
						.should('exist')
						.within(() => {
							cy.get('.blockera-feature-type').should(
								'have.length',
								74
							);

							// Searching verse block type.
							search('verse');

							cy.getByDataTest('not-found-text').should('exist');
						});
				}
			);

			// Check real allowed blocks.
			getAllowedBlocks().then((allowedBlocks) => {
				expect(58).to.be.deep.equal(allowedBlocks.length);
			});

			// Check value clean up and store api.
			getWPDataObject().then((data) => {
				// Assertion for store api.
				expect([
					'core/heading',
					'core/paragraph',
					'core/button',
					'core/verse',
				]).to.be.deep.equal(
					Object.keys(getBlockTypeInnerBlocksStore(data))
				);

				// Assertion for clean up value.
				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')
				);
			});
		});
	});
});
