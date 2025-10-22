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

describe('Page List Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:page-list /-->\n `);

		// Select target block
		cy.getBlock('core/page-list').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Icon extension is active
		cy.getByDataTest('settings-tab').click();
		cy.getByAriaLabel('Choose Icon…').should('be.visible');

		// switch back to style tab
		cy.getByDataTest('style-tab').click();

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'marker',
			'elements/item',
			'elements/item-container',
			'elements/current-page',
		]);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/page-list').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/page-list').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/item
		//
		setInnerBlock('elements/item');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/page-list')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.3. elements/item-container
		//
		setParentBlock();
		setInnerBlock('elements/item-container');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.2.1. Text color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/page-list')
			.first()
			.within(() => {
				cy.get('li')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');
			});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.getByDataTest('settings-tab').click();

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

		cy.get('.blockera-block.wp-block-page-list').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-page-list').within(() => {
			// elements/item
			cy.get('a')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/item-container
			cy.get('li')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 32, 32)');
		});
	});
});
