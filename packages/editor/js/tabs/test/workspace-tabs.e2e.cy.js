/**
 * End-to-end tests for Blockera workspace tabs (multi-document tab bar).
 *
 * Selectors: `test-id` values from `packages/editor/js/tabs/constants/testIds.ts`
 * (Cypress: `cy.getByTestId`, `cy.tabs*` workspace tab commands).
 *
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';

describe('Blockera workspace tabs', () => {
	/**
	 * Focus the post title field in the editor canvas and set text (works with
	 * contenteditable title and legacy textarea).
	 */
	const setPostTitleInCanvas = (text) => {
		cy.getIframeBody()
			.find('.edit-post-visual-editor__post-title-wrapper')
			.should('be.visible')
			.first()
			.within(() => {
				cy.get(
					'[contenteditable="true"], textarea.editor-post-title__input, .editor-post-title__input'
				)
					.first()
					.should('be.visible')
					.click({ force: true })
					.type('{selectall}{backspace}' + text, {
						delay: 0,
					});
			});
	};

	describe('document title sync', () => {
		/**
		 * Active tab label must track the document title while editing (including
		 * unsaved edits). With two tabs, switching documents should show each post’s
		 * current title on the active tab.
		 *
		 * @see packages/editor/js/tabs/components/Tab.tsx — useEntity for active tab
		 */
		it('should keep tab titles in sync when editing two posts and switching tabs', () => {
			const titleA = `TabA-${Date.now()}`;
			const titleB = `TabB-${Date.now()}`;

			createPost({ postType: 'post' });

			cy.tabsExpectUnpinnedCount(1);
			cy.tabsGetActiveTitle().should('be.visible');

			setPostTitleInCanvas(titleA);
			cy.tabsGetActiveTitle().should('contain.text', titleA);

			cy.tabsAddNewPost();
			cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });

			setPostTitleInCanvas(titleB);
			cy.tabsGetActiveTitle().should('contain.text', titleB);

			cy.tabsClickUnpinnedByIndex(0);
			cy.tabsGetActiveTitle().should('contain.text', titleA);

			cy.tabsClickUnpinnedByIndex(1);
			cy.tabsGetActiveTitle().should('contain.text', titleB);
		});

		it('should close an unpinned tab via the tab close control', () => {
			createPost({ postType: 'post' });
			cy.tabsExpectUnpinnedCount(1);

			cy.tabsAddNewPost();
			cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });

			cy.tabsCloseUnpinnedByIndex(1);
			cy.tabsExpectUnpinnedCount(1);
		});
	});
});
