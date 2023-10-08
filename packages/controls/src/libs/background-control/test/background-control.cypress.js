/**
 * Internal dependencies
 */
import { addBlockToPost } from '../../../../../../cypress/helpers';

describe('testing background extension with core/button block of WordPress', () => {
	it('should edit background repeater type to mesh gradient', () => {
		addBlockToPost('core/buttons', true);

		cy.get('div').contains('Background').click();

		cy.get('div[draggable="true"]').click();

		cy.get('[data-value="mesh-gradient"]').click();

		cy.get('[aria-label="Close Modal"]').click();

		cy.getIframeBody()
			.find('.is-root-container')
			.should('contain', 'background-image: radial-gradient');

		cy.get('button[aria-label="Add New"]').click();

		cy.get('div[draggable="true"]:last-child').click();

		cy.get('[data-value="mesh-gradient"]').click();

		cy.getIframeBody()
			.find('.is-root-container')
			.should('contain', 'background-image: radial-gradient');
	});
});
