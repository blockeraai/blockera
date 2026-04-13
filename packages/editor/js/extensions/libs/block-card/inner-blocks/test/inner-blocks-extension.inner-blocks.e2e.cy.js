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
	resetBlockState,
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
								90
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
								89
							);

							// Searching verse block type.
							search('verse');

							cy.getByDataTest('not-found-text').should('exist');
						});
				}
			);

			// Check real allowed blocks.
			getAllowedBlocks().then((allowedBlocks) => {
				expect(67).to.be.deep.equal(allowedBlocks.length);
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

	it('should reset inner block all values', () => {
		appendBlocks(
			`<!-- wp:latest-comments {"commentsToShow":3,"blockeraPropsId":"61c6adef-45f0-410f-9ea3-fc09ad27d79a","blockeraCompatId":"1023231430362","blockeraBackgroundColor":{"value":"#f5d5d5"},"blockeraBlockStates":{"value":{"hover":{"breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#fabbbb","blockeraInnerBlocks":{"elements/container":{"attributes":{"blockeraBackgroundColor":"#80e869","blockeraBorder":{"type":"all","all":{"width":"2px","style":"","color":"#60af4e"}}}}}}}},"isVisible":true},"after":{"breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#ff8383","blockeraSpacing":{"padding":{"top":"5px","right":"10px","bottom":"5px","left":"10px"}},"blockeraBorderRadius":{"type":"all","all":"60px"},"blockeraTextAlign":"center","blockeraFontSize":"16px","blockeraFontAppearance":{"weight":"1000","style":"normal"},"blockeraDisplay":"block"}},"mobile":{"attributes":{"blockeraDisplay":"inline-block"}}},"isVisible":true,"content":"After"},"before":{"content":"Before","breakpoints":{"desktop":{"attributes":{"blockeraSpacing":{"margin":{"bottom":"20px","left":"20px","right":"30px"},"padding":{"top":"10px","right":"10px","bottom":"10px","left":"10px"}},"blockeraBackgroundColor":"#fc9898","blockeraBorderRadius":{"type":"all","all":"5px"},"blockeraDisplay":"block"}},"mobile":{"attributes":{"blockeraSpacing":{"margin":{"right":"auto","left":"80px"}},"blockeraDisplay":"inline-block"}}},"isVisible":true},"normal":{"breakpoints":{"mobile":{"attributes":{"blockeraInnerBlocks":{"elements/comment-text":{"attributes":{"blockeraFlexLayout":{"direction":"column","alignItems":"center","justifyContent":"center"},"blockeraGap":{"lock":true,"gap":"10px","columns":"","rows":""}}},"elements/date":{"attributes":{"blockeraFlexLayout":{"direction":"column","alignItems":"center","justifyContent":"center"},"blockeraGap":{"lock":true,"gap":"10px","columns":"","rows":""}}},"elements/container":{"attributes":{"blockeraBlockStates":{"after":{"breakpoints":{"mobile":{"attributes":{"blockeraDisplay":"inline-block"}}},"isVisible":true,"content":"After"},"before":{"breakpoints":{"mobile":{"attributes":{"blockeraSpacing":{"margin":{"top":"101px"},"padding":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}}}}},"isVisible":true,"content":"Mobile Content"}}}}}}}},"isVisible":true}}},"blockeraBorder":{"value":{"type":"all","all":{"width":"2px","style":"","color":"#ff8787"}}},"blockeraBorderRadius":{"value":{"type":"all","all":"20px"}},"blockeraTransition":{"value":{"all-0":{"isVisible":true,"type":"all","duration":"500ms","timing":"ease","delay":"0ms","order":0}}},"blockeraInnerBlocks":{"value":{"elements/container":{"attributes":{"blockeraBackgroundColor":"#bfefb4","blockeraSpacing":{"padding":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}},"blockeraBorderRadius":{"type":"all","all":"20px"},"blockeraBorder":{"type":"all","all":{"width":"2px","style":"","color":"#85be79"}},"blockeraTransition":{"all-0":{"isVisible":true,"type":"all","duration":"500ms","timing":"ease","delay":"0ms","order":0}},"blockeraBlockStates":{"before":{"content":"before","breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#0000003b","blockeraDisplay":"block","blockeraFontSize":"16px","blockeraSpacing":{"margin":{"bottom":"10px"},"padding":{"top":"10px","right":"10px","bottom":"10px","left":"10px"}},"blockeraBorderRadius":{"type":"all","all":"10px"}}}},"isVisible":true},"after":{"content":"After","breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#0000003b","blockeraDisplay":"block","blockeraFontSize":"16px","blockeraSpacing":{"margin":{"top":"10px"},"padding":{"top":"10px","right":"10px","bottom":"10px","left":"10px"}},"blockeraBorderRadius":{"type":"all","all":"10px"}}}},"isVisible":true}}}},"elements/avatar":{"attributes":{"blockeraBorderRadius":{"type":"all","all":"5px"},"blockeraBorder":{"type":"all","all":{"width":"2px","style":"","color":"#0000004d"}},"blockeraWidth":"40px","blockeraHeight":"40px"}},"elements/author":{"attributes":{"blockeraBackgroundColor":"#fca53f","blockeraBlockStates":{"before":{"content":"before","breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#d97a0d","blockeraBorderRadius":{"type":"all","all":"10px"},"blockeraSpacing":{"padding":{"top":"5px","right":"5px","bottom":"5px","left":"5px"}}}}},"isVisible":true},"after":{"content":"After","breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#c36f0e","blockeraSpacing":{"padding":{"top":"5px","right":"5px","bottom":"5px","left":"5px"}},"blockeraBorderRadius":{"type":"all","all":"10px"}}}},"isVisible":true}},"blockeraDisplay":"flex","blockeraFlexLayout":{"direction":"row","alignItems":"center","justifyContent":"center"},"blockeraGap":{"lock":true,"gap":"20px","columns":"","rows":""}}},"elements/post-title":{"attributes":{"blockeraBackgroundColor":"#3cf3ed","blockeraBlockStates":{"before":{"content":"Before","breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#05d2cb"}}},"isVisible":true},"after":{"breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#00a39d"}}},"isVisible":true,"content":"After"}},"blockeraDisplay":"flex","blockeraGap":{"lock":true,"gap":"10px","columns":"","rows":""},"blockeraFlexLayout":{"direction":"row","alignItems":"center","justifyContent":"flex-start"}}},"elements/date":{"attributes":{"blockeraBackgroundColor":"#a9cdff","blockeraBlockStates":{"before":{"content":"Before","breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#5da3ff"}}},"isVisible":true},"after":{"content":"After","breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#5da3ff"}}},"isVisible":true}},"blockeraDisplay":"flex","blockeraFlexLayout":{"direction":"row","alignItems":"center","justifyContent":"center"},"blockeraGap":{"lock":true,"gap":"40px","columns":"","rows":""},"blockeraSpacing":{"margin":{"top":"20px"}}}},"elements/comment-text":{"attributes":{"blockeraBackgroundColor":"#f36bff","blockeraBlockStates":{"before":{"content":"Before","breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#c10bd2"}}},"isVisible":true},"after":{"content":"After","breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#ab00ba"}}},"isVisible":true}},"blockeraDisplay":"flex","blockeraFlexLayout":{"direction":"row","alignItems":"center","justifyContent":"center"},"blockeraGap":{"lock":true,"gap":"20px","columns":"","rows":""},"blockeraSpacing":{"margin":{"top":"20px"}}}}}},"blockeraSpacing":{"value":{"margin":{"bottom":"20px"},"padding":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}}},"className":"blockera-block blockera-block-1","style":{"spacing":{"margin":{"top":"","right":"30px","bottom":"20px","left":"20px"},"padding":{"top":"10px","right":"10px","bottom":"10px","left":"10px"}},"color":[],"border":{"radius":"20px","color":"#ff8787","width":"2px","style":""},"typography":[]}} /-->`
		);

		cy.getIframeBody().find('[data-type="core/latest-comments"]').click();

		resetBlockState('Item Container');

		//Check store
		getWPDataObject().then((data) => {
			expect({}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/container'
				].attributes
			);

			expect({}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraBlockStates').hover.breakpoints
					.desktop.attributes.blockeraInnerBlocks[
					'elements/container'
				].attributes
			);

			expect({}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraBlockStates').normal.breakpoints
					.mobile.attributes.blockeraInnerBlocks['elements/container']
					.attributes
			);
		});
	});
});
