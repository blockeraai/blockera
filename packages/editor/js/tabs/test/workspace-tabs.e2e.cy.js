/**
 * End-to-end tests for Blockera workspace tabs (multi-document tab bar).
 *
 * Selectors: `test-id` values from `packages/editor/js/tabs/constants/testIds.ts`
 * (Cypress: `cy.getByTestId`, `cy.tabs*` workspace tab commands).
 *
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';
import { WORKSPACE_TABS_TEST_ID } from 'blockera-editor-tabs-test-ids';

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
		 * Tab labels must track each document’s title (including unsaved edits via
		 * core-data). With two tabs, switching documents should show each post’s
		 * current title on the active tab.
		 *
		 * @see packages/editor/js/tabs/components/Tab.tsx — useEntity for every tab
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

			// First tab is inactive but must still show A’s live title (core-data), not stale tab.title.
			cy.get(
				'.blockera-tabs-bar-tabs__normal-tabs [test-id^="blockera-workspace-tab--"]'
			)
				.eq(0)
				.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
				.should('contain.text', titleA);

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

	describe('tab rename', () => {
		const unpinnedTabRoots =
			'.blockera-tabs-bar-tabs__normal-tabs [test-id^="blockera-workspace-tab--"]';

		/**
		 * Fill Rename Tab modal and save.
		 *
		 * @param {string} customTitle
		 */
		const saveRenameModal = (customTitle) => {
			cy.get('.blockera-tabs-rename-modal').should('be.visible');
			cy.get('.blockera-tabs-rename-modal')
				.find('.components-text-control__input')
				.clear()
				.type(customTitle, { delay: 0 });
			cy.get('.blockera-tabs-rename-modal')
				.contains('button', 'Save')
				.click();
		};

		/**
		 * Custom title must stay visible on an inactive tab; rename can be cleared from
		 * the context menu; double-click opens the same modal as “Rename tab”.
		 *
		 * @see packages/editor/js/tabs/components/Tab.tsx — double-click → onRename
		 */
		it('should show custom title on inactive tab, clear rename, and support double-click rename', () => {
			const titleA = `TabA-${Date.now()}`;
			const titleB = `TabB-${Date.now()}`;
			const customTabLabel = `Custom-${Date.now()}`;
			const dblClickLabel = `Dbl-${Date.now()}`;

			createPost({ postType: 'post' });
			cy.tabsExpectUnpinnedCount(1);

			setPostTitleInCanvas(titleA);

			cy.tabsAddNewPost();
			cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });

			setPostTitleInCanvas(titleB);
			cy.tabsGetActiveTitle().should('contain.text', titleB);

			// Rename first tab via context menu while the second tab is active.
			cy.get(unpinnedTabRoots).eq(0).rightclick();
			cy.contains('[role="menuitem"]', 'Rename tab').click();
			saveRenameModal(customTabLabel);

			cy.tabsClickUnpinnedByIndex(1);
			cy.tabsGetActiveTitle().should('contain.text', titleB);
			cy.get(unpinnedTabRoots)
				.eq(0)
				.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
				.should('contain.text', customTabLabel);

			// Clear rename from context menu; label falls back to post title.
			cy.tabsClickUnpinnedByIndex(0);
			cy.get(unpinnedTabRoots).eq(0).rightclick();
			cy.contains('[role="menuitem"]', 'Clear tab rename').click();
			cy.get(unpinnedTabRoots)
				.eq(0)
				.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
				.should('contain.text', titleA);

			cy.get(unpinnedTabRoots).eq(0).dblclick();
			saveRenameModal(dblClickLabel);

			cy.tabsClickUnpinnedByIndex(1);
			cy.get(unpinnedTabRoots)
				.eq(0)
				.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
				.should('contain.text', dblClickLabel);

			cy.tabsClickUnpinnedByIndex(0);
			cy.get(unpinnedTabRoots).eq(0).dblclick();
			cy.get('.blockera-tabs-rename-modal')
				.contains('button', 'Remove rename')
				.click();
			cy.get(unpinnedTabRoots)
				.eq(0)
				.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
				.should('contain.text', titleA);
		});
	});
});
