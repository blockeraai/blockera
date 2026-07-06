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

describe('Breadcrumbs Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks('<!-- wp:breadcrumbs /-->\n ');

		// Select target block
		cy.getBlock('core/breadcrumbs').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'elements/trail-item',
			'elements/separator',
			'elements/current-trail-item',
		]);

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/trail-item
		//
		setInnerBlock('elements/trail-item');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		cy.setColorControlValue('Text Color', 'ff0000');

		cy.getBlock('core/breadcrumbs')
			.first()
			.within(() => {
				cy.get('ol li a')
					.first()
					.should('have.css', 'color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/separator
		//
		setParentBlock();
		setInnerBlock('elements/separator');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		cy.setColorControlValue('Text Color', '00ff00');

		cy.getBlock('core/breadcrumbs')
			.first()
			.within(() => {
				cy.get('ol li:not(:last-child)')
					.first()
					.then(($li) => {
						const color = window.getComputedStyle(
							$li[0],
							'::after'
						).color;

						expect(color).to.equal('rgb(0, 255, 0)');
					});
			});

		//
		// 1.3. elements/current-trail-item
		//
		setParentBlock();
		setInnerBlock('elements/current-trail-item');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		cy.setColorControlValue('Text Color', '0000ff');

		cy.getBlock('core/breadcrumbs')
			.first()
			.within(() => {
				cy.get('ol li:last-child span[aria-current="page"]')
					.first()
					.should('have.css', 'color', 'rgb(0, 0, 255)');
			});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.get('[role="tab"][aria-label="Settings"]').click();

		cy.get('.block-editor-block-inspector').within(() => {
			// block settings panel body should be visible
			cy.get('.components-tools-panel:not(.block-editor-bindings__panel)')
				.should('exist')
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-breadcrumbs').within(() => {
			cy.get('ol li a')
				.first()
				.should('have.css', 'color', 'rgb(255, 0, 0)');

			cy.get('ol li:not(:last-child)')
				.first()
				.then(($li) => {
					const color = window.getComputedStyle(
						$li[0],
						'::after'
					).color;

					expect(color).to.equal('rgb(0, 255, 0)');
				});

			cy.get('ol li:last-child span[aria-current="page"]')
				.first()
				.should('have.css', 'color', 'rgb(0, 0, 255)');
		});
	});
});
