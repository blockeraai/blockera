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

describe('Social Link Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors in editor and front-end', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/social-link').first().click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/item-icon
		//
		setInnerBlock('elements/item-icon');

		//
		// 1.1.1. BG color
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
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').within(() => {
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
