/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Featured Image Block → Selectors test', () => {
	beforeEach(() => {
		createPost();
	});

	it('Check Attributes CSS selectors customization to work in editor and front-end', () => {
		//
		// Set a featured image
		//
		cy.openDocumentSettingsSidebar('Page');
		cy.get('button').contains('Set featured image').click();
		cy.get('#menu-item-upload').click();
		cy.get('input[type="file"]').selectFile(
			'packages/dev-cypress/js/fixtures/test.jpg',
			{
				force: true,
			}
		);
		cy.get('.media-toolbar-primary > .button').click();

		//
		// Add block
		//

		appendBlocks(`<!-- wp:post-featured-image /-->`);

		// Select target block
		cy.getBlock('core/post-featured-image').click();

		//
		// Border
		//
		cy.getParentContainer('Border Line').as('borderContainer');
		cy.get('@borderContainer').within(() => {
			cy.getByDataTest('border-control-width').clear();
			cy.getByDataTest('border-control-width').type(5, {
				force: true,
			});

			cy.getByDataTest('border-control-color').click();
		});

		cy.getByDataTest('popover-body')
			.first()
			.within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('37e6d4 ');
			});

		cy.get('@borderContainer').within(() => {
			cy.get('[aria-haspopup="listbox"]').click();
			cy.get('div[aria-selected="false"]').eq(1).click();
		});
		cy.getBlock('core/post-featured-image')
			.first()
			.within(() => {
				cy.get('img').should(
					'have.css',
					'border',
					'5px dashed rgb(55, 230, 212)'
				);
			});

		//
		// Border Radius
		//
		cy.getParentContainer('Radius').within(() => {
			cy.get('input[type="number"]').clear({ force: true });
			cy.get('input[type="number"]').type(25, { force: true });
		});
		cy.getBlock('core/post-featured-image')
			.first()
			.within(() => {
				cy.get('img').should('have.css', 'border-radius', '25px');
			});

		//
		// Box Shadow
		//
		cy.getParentContainer('Box Shadows').within(() => {
			cy.get('[aria-label="Add New Box Shadow"]').click({
				force: true,
			});
		});

		cy.getByDataTest('popover-body')
			.last()
			.within(() => {
				cy.getByDataTest('box-shadow-x-input').clear({ force: true });
				cy.getByDataTest('box-shadow-x-input').type(10, {
					force: true,
				});

				cy.getByDataTest('box-shadow-y-input').clear({ force: true });
				cy.getByDataTest('box-shadow-y-input').type(50, {
					force: true,
				});

				cy.getByDataTest('box-shadow-blur-input').clear({
					force: true,
				});
				cy.getByDataTest('box-shadow-blur-input').type(30, {
					force: true,
				});

				cy.getByDataTest('box-shadow-spread-input').clear({
					force: true,
				});
				cy.getByDataTest('box-shadow-spread-input').type(40, {
					force: true,
				});

				cy.getByDataTest('box-shadow-color-control').click({
					force: true,
				});
			});

		cy.getByDataTest('popover-body')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('c5eef0ab ');
			});
		cy.getBlock('core/post-featured-image')
			.first()
			.within(() => {
				cy.get('img').should(
					'have.css',
					'box-shadow',
					'rgba(197, 238, 240, 0.67) 10px 50px 30px 40px'
				);
			});

		//
		// Filter
		//
		cy.getParentContainer('Filters').within(() => {
			cy.getByAriaLabel('Add New Filter Effect').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.getParentContainer('Type').within(() => {
					cy.get('select').select('drop-shadow');
				});

				cy.getByDataTest('filter-drop-shadow-x-input').clear();
				cy.getByDataTest('filter-drop-shadow-x-input').type(50);

				cy.getByDataTest('filter-drop-shadow-y-input').clear();
				cy.getByDataTest('filter-drop-shadow-y-input').type(30);

				cy.getByDataTest('filter-drop-shadow-blur-input').clear();
				cy.getByDataTest('filter-drop-shadow-blur-input').type(40);

				cy.getByDataTest('filter-drop-shadow-color').click();
			});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('cccccc ');
			});

		cy.getBlock('core/post-featured-image')
			.first()
			.within(() => {
				cy.get('img')
					.should('have.css', 'filter')
					.and('match', /^drop-shadow\(/);
			});

		//
		// Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-post-featured-image').within(() => {
			cy.get('img')
				.first()
				.should('have.css', 'border', '5px dashed rgb(55, 230, 212)')
				.should('have.css', 'border-radius', '25px')
				.should(
					'have.css',
					'box-shadow',
					'rgba(197, 238, 240, 0.67) 10px 50px 30px 40px'
				)
				.should('have.css', 'filter')
				.and('match', /^drop-shadow\(/);
		});
	});
});
