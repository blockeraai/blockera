/**
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';

/**
 * We should test to checking hide WordPress breakpoint and post preview elements and rendering canvas editor at the top bar.
 *
 * Our target of below tests is just ensure of correctly working portal and observer apis.
 */
describe('Canvas editor testing', () => {
	beforeEach(() => {
		createPost();
	});

	it('should hidden WordPress post preview and breakpoint drop down elements', () => {
		cy.get('a[aria-label="View Post"]').should('not.exist');
		cy.get('.editor-preview-dropdown').should(
			'have.css',
			'display',
			'none'
		);
	});

	it('should rendered blockera canvas editor at the header top bar', () => {
		cy.getByDataTest('blockera-canvas-editor').should('exist');
	});
});
