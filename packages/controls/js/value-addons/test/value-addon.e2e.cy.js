/**
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';

describe('Value Addon → Functionality', () => {
	beforeEach(() => {
		createPost();
	});

	describe('General Functionalities', () => {
		it('Open and pick variable', () => {
			cy.getBlock('default').type('This is test paragraph', { delay: 0 });
			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Width').within(() => {
				cy.openValueAddon();
			});

			// select variable
			cy.selectValueAddonItem('contentSize');

			// Check block
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'width: var(--wp--style--global--content-size)'
					);
			});
		});

		it('Open value addon by typing "--"', () => {
			cy.getBlock('default').type('This is test paragraph', { delay: 0 });
			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Width').within(() => {
				cy.get('input').type('--');
			});

			// select variable
			cy.selectValueAddonItem('contentSize');

			// Check block
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'width: var(--wp--style--global--content-size)'
					);
			});
		});
	});
});
