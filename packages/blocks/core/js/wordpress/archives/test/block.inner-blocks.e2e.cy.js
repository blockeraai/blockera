/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	setBoxSpacingSide,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Archives Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors in block editor and front-end', () => {
		appendBlocks(`<!-- wp:archives /-->\n `);

		// Select target block
		cy.getBlock('core/archives').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/item
		//
		setInnerBlock('elements/item');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/archives')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/item-marker
		//
		setParentBlock();
		setInnerBlock('elements/item-marker');

		//
		// 1.2.1. Text color
		//
		cy.setColorControlValue('Text Color', '00ffdf');

		cy.getBlock('core/archives')
			.first()
			.within(() => {
				cy.get('li')
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
		// 1.3. elements/item-container
		//
		setParentBlock();
		setInnerBlock('elements/item-container');

		//
		// 1.2.1. Text color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/archives')
			.first()
			.within(() => {
				cy.get('li')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-archives').within(() => {
			// elements/item
			cy.get('a')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/item-container
			cy.get('li')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 32, 32)');

			// elements/item-marker
			cy.get('li')
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
