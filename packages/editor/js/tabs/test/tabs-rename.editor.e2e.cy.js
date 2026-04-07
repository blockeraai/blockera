/**
 * End-to-end tests for Blockera workspace tabs — core tab bar UI (split from
 * workflows spec to reduce Chrome renderer memory pressure in CI).
 *
 * Selectors: `test-id` values from `packages/editor/js/tabs/constants/testIds.ts`
 * (Cypress: `cy.getByTestId`, `cy.tabs*` — e.g. `tabsExpectUnpinnedCount`,
 * `tabsExpectPinnedCount`, `tabsClickUnpinnedByIndex`, `tabsClickPinnedByIndex`,
 * `tabsExpectUnpinnedUnsavedIndicator`, `tabsResetWorkspaceStorage`,
 * `tabsResetTabsRelatedStorage`, `tabsOpenToolbarMenu`, `tabsStubWindowOpen`,
 * `tabsStubClipboardWrite`, `tabsExpectLimitUpgradePrompt`).
 *
 * @see workspace-2.editor.e2e.cy.js — recently closed, bulk edit, Pro limits
 */
import { createPost, savePage } from '@blockera/dev-cypress/js/helpers';
import { WORKSPACE_TABS_TEST_ID } from 'blockera-editor-tabs-test-ids';

import { setPostTitleInCanvas } from './workspace-e2e-helpers';

describe('Workspace tabs: Rename', () => {
	const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

	/**
	 * Fill Rename Tab modal and save.
	 *
	 * @param {string} customTitle
	 */
	const saveRenameModal = (customTitle) => {
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.renameModal).should('be.visible');
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.renameModalInput)
			.clear()
			.type(customTitle, { delay: 0 });
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.renameModalSave).click();
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
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuRenameTab).click();
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
		cy.getByTestId(
			WORKSPACE_TABS_TEST_ID.contextMenuClearTabRename
		).click();
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
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.renameModalRemoveRename).click();
		cy.get(unpinnedTabRoots)
			.eq(0)
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('contain.text', titleA);
	});
});
