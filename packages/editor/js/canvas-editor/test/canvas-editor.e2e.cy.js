/**
 * Blockera dependencies
 */
import {
	createPost,
	goTo,
	appendBlocks,
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

	// We should double check this test suite because this is flaky test!
	// After fix this, we need to update Jira ISSUE status: https://blockera.atlassian.net/browse/BPB-138
	it.skip('should rendered blockera canvas editor at the header top bar of Site Editor while switch between edit and init components', () => {
		goTo('/wp-admin/site-editor.php').then(() => {
			// eslint-disable-next-line
			cy.wait(2000);
		});

		cy.getIframeBody().find('main').click({ force: true });

		cy.getByDataTest('blockera-canvas-editor').should('exist');

		// We should use selector, because not founded any other data attribute for WordPress view mode toggle button.
		cy.get('button.edit-site-layout__view-mode-toggle').click({
			force: true,
		});

		cy.getIframeBody()
			.find('main')
			.click({ force: true })
			.then(() => {
				cy.wait(2000);

				cy.getByDataTest('blockera-canvas-editor').should('exist');
			});
	});

	it('should rendered blockera canvas editor at the header top bar of Site Editor', () => {
		goTo('/wp-admin/site-editor.php?canvas=edit').then(() => {
			// eslint-disable-next-line
			cy.wait(2000);
		});

		cy.getByDataTest('blockera-canvas-editor').should('exist');
	});

	it('should rendered the blockera breakpoints navbar at the top of the page while "Top toolbar" is enabled', () => {
		createPost();

		appendBlocks(
			'<!-- wp:paragraph -->\n' +
				'<p>test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();

		cy.get('[aria-label="Options"]').first().click();

		cy.get('button')
			.contains('Top toolbar')
			.then(($button) => {
				if ($button.attr('aria-checked') !== 'true') {
					$button.click();
				}
			});

		cy.getByAriaLabel('Desktop').should('be.visible');
		cy.getByAriaLabel('Hide block tools').click();
		cy.getByAriaLabel('Desktop').should('be.visible');

		cy.get('[aria-label="Options"]').eq(1).click();

		// We should disable top toolbar to ensure of rendering canvas editor at the header top bar for remaining other tests.
		cy.get('button')
			.contains('Top toolbar')
			.then(($button) => {
				$button.click();
			});
	});
});
