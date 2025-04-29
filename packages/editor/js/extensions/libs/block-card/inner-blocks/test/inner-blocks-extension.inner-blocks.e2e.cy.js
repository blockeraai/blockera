/**
 * Blockera dependencies
 */
import {
	search,
	createPost,
	appendBlocks,
	reSelectBlock,
	getWPDataObject,
	getSelectedBlock,
	getAllowedBlocks,
	openInserterInnerBlock,
	openInnerBlocksExtension,
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
		it('should exists just "elements/link" inner block type as forces in paragraph selected block and disable inserter block type', () => {
			cy.getBlock('default').type('This is test paragraph', { delay: 0 });

			// Opening Extension.
			openInnerBlocksExtension();

			// Check count of added inner blocks.
			cy.getByDataCy('repeater-item').should('have.length', 1);

			// Add Inner Block checking status.
			openInserterInnerBlock('disabled');

			// Checking to not exists inserter block type on the document.
			cy.getByDataTest('popover-body').should('not.exist');

			// Check real allowed blocks.
			getAllowedBlocks().then((allowedBlocks) => {
				expect(0).to.be.deep.equal(allowedBlocks.length);
			});

			// Check value clean up and store api.
			getWPDataObject().then((data) => {
				// Assertion for store api.
				expect(['elements/link']).to.be.deep.equal(
					Object.keys(getBlockTypeInnerBlocksStore(data))
				);

				// Assertion for clean up value.
				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')
				);
			});
		});

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

					// Opening Extension.
					openInnerBlocksExtension();
				}
			);

			context(
				'Checking forces items, and inserter items count with searching "buttons" block type to select that',
				() => {
					cy.getByDataTest('core/paragraph').should('exist');
					cy.getByDataTest('elements/link').should('exist');
					cy.getByDataTest('core/button').should('exist');
					cy.getByDataTest('core/heading').should('exist');

					// Add Inner Block click.
					openInserterInnerBlock();

					// Checking opened inserter block types.
					cy.getByDataTest('popover-body')
						.should('exist')
						.within(() => {
							cy.getByDataTest(
								'blockera-inner-block-type'
							).should('have.length', 62);

							// Searching buttons block type.
							search('buttons');

							cy.getByDataTest(
								'blockera-inner-block-type'
							).should('have.length', 1);

							cy.getByAriaLabel('core/buttons').click({
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

					// Opening Extension.
					openInnerBlocksExtension();

					cy.getByDataTest('core/paragraph').should('exist');
					cy.getByDataTest('elements/link').should('exist');
					cy.getByDataTest('core/button').should('exist');
					cy.getByDataTest('core/heading').should('exist');
					cy.getByDataTest('core/buttons').should('exist');

					// Add Inner Block click.
					openInserterInnerBlock();

					// Checking opened inserter block types.
					cy.getByDataTest('popover-body')
						.should('exist')
						.within(() => {
							cy.getByDataTest(
								'blockera-inner-block-type'
							).should('have.length', 61);

							// Searching buttons block type.
							search('buttons');

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
					'elements/link',
					'core/button',
					'core/buttons',
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
