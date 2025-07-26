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

describe('Search Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(
			'<!-- wp:search {"label":"Search Title","buttonText":"Search"} /-->\n '
		);

		// Select target block
		cy.getBlock('core/search').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'elements/label',
			'elements/input',
			'elements/button',
		]);

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/search').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/search').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/label
		//
		setInnerBlock('elements/label');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/search')
			.first()
			.within(() => {
				cy.get('.wp-block-search__label')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/input
		//
		setParentBlock();
		setInnerBlock('elements/input');

		cy.checkBlockCardItems(
			['normal', 'hover', 'focus', 'placeholder'],
			true
		);

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/search')
			.first()
			.within(() => {
				cy.get('.wp-block-search__input')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.3. elements/button
		//
		setParentBlock();
		setInnerBlock('elements/button');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/search')
			.first()
			.within(() => {
				cy.get('.wp-block-search__button')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
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
				.should('not.be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-search').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-search').within(() => {
			// elements/label
			cy.get('.wp-block-search__label')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/input
			cy.get('.wp-block-search__input')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/button
			cy.get('.wp-block-search__button')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});
