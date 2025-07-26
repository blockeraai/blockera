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

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Social Link Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/social-link').first().click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'focus',
			'active',
			'elements/item-icon',
			'elements/item-name',
		]);

		//
		// 1. Edit Block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/social-link').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/social-link').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.2. elements/item-icon
		//
		setInnerBlock('elements/item-icon');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/social-link')
			.first()
			.within(() => {
				cy.get('svg')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/item-name
		//
		setParentBlock();
		setInnerBlock('elements/item-name');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/social-link')
			.first()
			.within(() => {
				cy.get('.wp-block-social-link-label')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');
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
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-social-link').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-social-link').within(() => {
			// elements/item-icon
			cy.get('svg')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/item-name
			cy.get('.wp-block-social-link-label')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 32, 32)');
		});
	});
});
