/**
 * Blockera dependencies
 */
import {
	createPost,
	disableGutenbergFeatures,
	goTo,
	setAbsoluteBlockToolbar,
} from '@blockera/dev-cypress/js/helpers';

/**
 * We should test to checking hide WordPress breakpoint and post preview elements and rendering canvas editor at the top bar.
 *
 * Our target of below tests is just ensure of correctly working portal and observer apis.
 */
describe('Canvas editor testing', () => {
	it('should hidden WordPress post preview and breakpoint drop down elements', () => {
		createPost();

		cy.get('a[aria-label="View Post"]').should('not.exist');
		cy.get('.editor-preview-dropdown').should(
			'have.css',
			'display',
			'none'
		);
	});

	it('should rendered blockera canvas editor at the header top bar of Post Editor', () => {
		createPost();

		cy.getByDataTest('blockera-canvas-editor').should('exist');
	});

	it('should rendered blockera canvas editor at the header top bar of Site Editor', () => {
		goTo('/wp-admin/site-editor.php?canvas=edit').then(() => {
			// eslint-disable-next-line
			cy.wait(2000);
		});

		cy.getByDataTest('blockera-canvas-editor').should('exist');
	});
});
