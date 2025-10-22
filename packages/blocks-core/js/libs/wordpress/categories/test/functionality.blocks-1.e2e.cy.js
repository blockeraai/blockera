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

describe('Categories Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:categories /--> `);

		// Select target block
		cy.getBlock('core/categories').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'elements/term-item',
			'elements/list-item',
		]);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Check icon extension & inner block
		//
		cy.getByDataTest('settings-tab').click();

		cy.getByAriaLabel('Choose Icon…').click();

		cy.get('[data-wp-component="Popover"]')
			.last()
			.within(() => {
				cy.getByAriaLabel('add-card Icon').click();
			});

		// switch by advanced icon settings button from extension
		cy.getByAriaLabel('Advanced Icon Settings').click();

		cy.get('.blockera-extension-block-card.block-card--inner-block')
			.should('exist')
			.within(() => {
				// the block states should not be available
				cy.getByDataId('normal').should('not.exist');
				cy.getByDataId('hover').should('not.exist');
			});

		setParentBlock();

		// switch back to style tab
		cy.getByDataTest('style-tab').click();

		//
		// 1.1. Block Styles
		//
		cy.getBlock('core/categories').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/categories').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.2. Term item inner block
		//
		setInnerBlock('elements/term-item');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc ');

		cy.getBlock('core/categories')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);
			});

		//
		// 1.3. Term parent inner block
		//
		setParentBlock();
		setInnerBlock('elements/list-item');

		cy.checkBlockCardItems(['normal', 'hover', 'marker'], true);

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('BG Color', 'eeeeee ');

		cy.getBlock('core/categories')
			.first()
			.within(() => {
				cy.get('li.cat-item')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(238, 238, 238)'
					);
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
				.scrollIntoView()
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-categories').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-categories').within(() => {
			// term inner block
			cy.get('a')
				.first()
				.should('have.css', 'background-color', 'rgb(204, 204, 204)');

			// term parent inner block
			cy.get('li.cat-item')
				.first()
				.should('have.css', 'background-color', 'rgb(238, 238, 238)');
		});
	});
});
