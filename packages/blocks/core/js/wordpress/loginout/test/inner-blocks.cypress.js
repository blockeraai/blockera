/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
	openBlockNavigator,
} from '@blockera/dev-cypress/js/helpers';

describe('Loginout Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(`<!-- wp:loginout {"displayLoginAsForm":true} /-->`);

		// because of unknown issue we can not select bock from the editor
		openBlockNavigator();

		cy.get('[aria-label="Login/out"]').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Form Container Customize').should('exist');
				cy.getByAriaLabel('Input Labels Customize').should('exist');
				cy.getByAriaLabel('Inputs Customize').should('exist');
				cy.getByAriaLabel('Remember Me Customize').should('exist');
				cy.getByAriaLabel('Submit Button Customize').should('exist');

				cy.getByAriaLabel('Links Customize').should('not.exist');
			}
		);
	});
});
