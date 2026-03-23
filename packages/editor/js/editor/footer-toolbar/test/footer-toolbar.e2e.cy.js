/**
 * Blockera dependencies
 */
import {
	createPost,
	goTo,
	closeWelcomeGuide,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Footer toolbar: Blockera brand/version injected via Fill into the editor footer slot.
 * @see packages/editor/js/editor/footer-toolbar/
 */
describe('Footer toolbar', () => {
	const assertFooterToolbarInEditor = () => {
		cy.get('.blockera-footer-toolbar-items', { timeout: 30000 }).should(
			'be.visible'
		);
		cy.get('.blockera-footer-toolbar-brand')
			.should('be.visible')
			.and('have.attr', 'href')
			.and('include', 'blockera.ai');
		cy.get('.blockera-footer-toolbar-version').should('be.visible');
	};

	it('should render Blockera footer toolbar in the Post Editor', () => {
		createPost();
		assertFooterToolbarInEditor();
	});

	it('should render Blockera footer toolbar in the Site Editor (canvas edit)', () => {
		goTo('/wp-admin/site-editor.php?canvas=edit').then(() => {
			closeWelcomeGuide();
		});

		assertFooterToolbarInEditor();
	});
});
