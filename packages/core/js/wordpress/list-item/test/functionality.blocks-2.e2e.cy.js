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

describe('List Item Block → Functionality + Inner blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>item 1 <a href="#">link is here</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>item 2 <a href="#">link is here</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->`);

		// Select target block
		cy.getBlock('core/list-item').first().click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/list-item')
			.first()
			.should('not.have.css', 'background-clip', 'padding-box');

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/list-item')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		//
		// 1.1. elements/item-marker
		//
		setInnerBlock('elements/item-marker');

		//
		// 1.1.1. Text color
		//
		cy.setColorControlValue('Text Color', '00ffdf');

		cy.getBlock('core/list')
			.first()
			.within(() => {
				cy.get('li')
					.first()
					.within(($el) => {
						cy.wait(2000);

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

				cy.get('li')
					.last()
					.within(($el) => {
						cy.wait(2000);

						cy.window().then((win) => {
							const marker = win.getComputedStyle(
								$el[0],
								'::marker'
							);
							const markerColor =
								marker.getPropertyValue('color');
							expect(markerColor).not.to.equal(
								'rgb(0, 255, 223)'
							);
						});
					});
			});

		//
		// 1.2. elements/link
		//
		setParentBlock();
		setInnerBlock('elements/link');

		//
		// 1.2.1. Text color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/list')
			.first()
			.within(() => {
				// first link should have background color
				cy.get('a')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');

				// last link should not have background color
				cy.get('a')
					.last()
					.should(
						'not.have.css',
						'background-color',
						'rgb(255, 32, 32)'
					);
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.wp-block-list li.blockera-block')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		cy.get('.wp-block-list')
			.first()
			.within(() => {
				// first link should have background color
				cy.get('li.blockera-block')
					.first()
					.within(() => {
						cy.get('a').should(
							'have.css',
							'background-color',
							'rgb(255, 32, 32)'
						);
					});

				// last link should not have background color
				cy.get('li')
					.last()
					.within(() => {
						cy.get('a').should(
							'not.have.css',
							'background-color',
							'rgb(255, 32, 32)'
						);
					});

				// elements/item-marker
				cy.get('li.blockera-block')
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

				cy.get('li')
					.last()
					.within(($el) => {
						cy.window().then((win) => {
							const marker = win.getComputedStyle(
								$el[0],
								'::marker'
							);
							const markerColor =
								marker.getPropertyValue('color');
							expect(markerColor).not.to.equal(
								'rgb(0, 255, 223)'
							);
						});
					});
			});
	});
});
