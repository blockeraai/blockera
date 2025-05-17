/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Details Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:details -->
<details class="wp-block-details"><summary>test title</summary><!-- wp:paragraph {"placeholder":"Type / to add a hidden block"} -->
<p>Paragraph text...</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->`);

		// Select target block
		cy.getBlock('core/details').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Block card states and inner blocks active items
		[
			'normal',
			'hover',
			'open',
			'elements/title',
			'elements/title-icon',
			'core/paragraph',
		].forEach((state) => {
			cy.get(`[data-cy="repeater-item"][data-id="${state}"]`).should(
				'be.visible'
			);
		});

		['elements/link'].forEach((state) => {
			cy.get(`[data-cy="repeater-item"][data-id="${state}"]`).should(
				'not.exist'
			);
		});

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/details').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/details').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/item
		//
		setInnerBlock('elements/title');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/details')
			.first()
			.within(() => {
				cy.get('summary')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/title-cion
		//
		setParentBlock();
		setInnerBlock('elements/title-icon');

		//
		// 1.2.1. Text color
		//
		cy.setColorControlValue('Text Color', '00ffdf');

		cy.getBlock('core/details')
			.first()
			.within(() => {
				cy.get('summary')
					.first()
					.within(($el) => {
						cy.window().then((win) => {
							const marker = win.getComputedStyle(
								$el[0],
								'::marker'
							);
							const markerColor =
								marker.getPropertyValue('color');
							expect(markerColor).to.equal('rgb(0, 255, 223)');
						});
					});
			});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.getByDataTest('settings-tab').click();

		// layout settings should be hidden
		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-tools-panel-header')
				.contains('Settings')
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-details').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-details').within(() => {
			// elements/title
			cy.get('summary')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/title-icon
			cy.get('summary')
				.first()
				.within(($el) => {
					cy.window().then((win) => {
						const marker = win.getComputedStyle($el[0], '::marker');
						const markerColor = marker.getPropertyValue('color');
						expect(markerColor).to.equal('rgb(0, 255, 223)');
					});
				});
		});
	});
});
