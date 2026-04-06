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

describe('Workspace tabs: Title', () => {
	const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

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
			`.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`
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

	it('should disable the close control when there is only one tab', () => {
		createPost({ postType: 'post' });
		cy.tabsExpectUnpinnedCount(1);

		// The single unpinned tab should not be closable.
		cy.get(unpinnedTabRoots)
			.eq(0)
			.find(`[test-id^="blockera-workspace-tabs-close--"]`)
			.should('be.disabled');
	});

	/**
	 * Context menu: Close, Close to the right, Close others.
	 * Default unpinned tab limit is 3 (`resolveTabsConfig`), so each action is
	 * exercised in the same `it` with a fresh three-tab setup (createPost + two adds).
	 *
	 * @see packages/editor/js/tabs/utils/tabsConfig.ts
	 * @see packages/editor/js/tabs/utils/tabActions.ts — closeTab / closeToRight / closeOthers
	 * @see packages/editor/js/tabs/components/TabContextMenu.tsx
	 */
	it('should apply Close, Close to the right, and Close others from the tab context menu', () => {
		/**
		 * Save each document so bulk close actions do not open the unsaved
		 * confirmation (see TabsManager `findTabsToClose` for toRight/others).
		 */
		const saveAllUnpinnedTabs = () => {
			cy.tabsClickUnpinnedByIndex(0);
			savePage();
			cy.tabsClickUnpinnedByIndex(1);
			savePage();
			cy.tabsClickUnpinnedByIndex(2);
			savePage();
		};

		const openThreeUnpinnedTabs = (prefix) => {
			const t0 = `${prefix}0-${Date.now()}`;
			const t1 = `${prefix}1-${Date.now()}`;
			const t2 = `${prefix}2-${Date.now()}`;

			cy.tabsResetWorkspaceStorage();
			createPost({ postType: 'post' });
			cy.tabsExpectUnpinnedCount(1);
			setPostTitleInCanvas(t0);

			cy.tabsAddNewPost();
			cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
			setPostTitleInCanvas(t1);

			cy.tabsAddNewPost();
			cy.tabsExpectUnpinnedCount(3, { timeout: 60000 });
			setPostTitleInCanvas(t2);

			saveAllUnpinnedTabs();

			return { t0, t1, t2 };
		};

		// 1) Close — remove the middle tab (t1).
		const closeTitles = openThreeUnpinnedTabs('Close');
		cy.get(unpinnedTabRoots).eq(1).rightclick();
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuClose).click();
		cy.tabsExpectUnpinnedCount(2);
		cy.get(unpinnedTabRoots)
			.eq(0)
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('contain.text', closeTitles.t0);
		cy.get(unpinnedTabRoots)
			.eq(1)
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('contain.text', closeTitles.t2);

		// 2) Close to the right — from the first tab, remove unpinned tabs to its right.
		const toRightTitles = openThreeUnpinnedTabs('Right');
		cy.get(unpinnedTabRoots).eq(0).rightclick();
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuCloseToRight).click();
		cy.tabsExpectUnpinnedCount(1);
		cy.get(unpinnedTabRoots)
			.eq(0)
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('contain.text', toRightTitles.t0);
		cy.tabsGetActiveTitle().should('contain.text', toRightTitles.t0);

		// 3) Close others — keep the middle tab; remove the other unpinned tabs.
		const othersTitles = openThreeUnpinnedTabs('Others');
		cy.get(unpinnedTabRoots).eq(1).rightclick();
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuCloseOthers).click();
		cy.tabsExpectUnpinnedCount(1);
		cy.get(unpinnedTabRoots)
			.eq(0)
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('contain.text', othersTitles.t1);
		cy.tabsGetActiveTitle().should('contain.text', othersTitles.t1);
	});

	/**
	 * Unsaved dot next to the tab title (hasUnsavedChanges); clears after save.
	 *
	 * @see packages/editor/js/tabs/components/Tab.tsx — blockera-tabs-unsaved-indicator
	 */
	it('should show an unsaved indicator on the tab title after edits and remove it after save', () => {
		createPost({ postType: 'post' });
		cy.tabsExpectUnpinnedCount(1);
		cy.tabsExpectUnpinnedUnsavedIndicator(0, false);

		setPostTitleInCanvas(`Unsaved-${Date.now()}`);
		cy.tabsExpectUnpinnedUnsavedIndicator(0, true);

		savePage();
		cy.tabsExpectUnpinnedUnsavedIndicator(0, false);
	});

	it('should show the unsaved indicator on an inactive tab until save', () => {
		const titleA = `IndA-${Date.now()}`;
		const titleB = `IndB-${Date.now()}`;
		const titleAEdited = `${titleA}-edit`;

		createPost({ postType: 'post' });
		cy.tabsExpectUnpinnedCount(1);

		setPostTitleInCanvas(titleA);
		savePage();

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
		setPostTitleInCanvas(titleB);

		cy.tabsClickUnpinnedByIndex(0);
		setPostTitleInCanvas(titleAEdited);
		cy.tabsExpectUnpinnedUnsavedIndicator(0, true);

		cy.tabsClickUnpinnedByIndex(1);
		cy.tabsGetActiveTitle().should('contain.text', titleB);
		cy.tabsExpectUnpinnedUnsavedIndicator(0, true);

		savePage();
		cy.tabsExpectUnpinnedUnsavedIndicator(0, false);
	});

	it('should open the close confirmation modal when closing a single tab with unsaved changes (and cancel keeps the tab)', () => {
		const titleA = `DirtyA-${Date.now()}`;
		const titleB = `DirtyB-${Date.now()}`;

		createPost({ postType: 'post' });
		cy.tabsExpectUnpinnedCount(1);

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
		setPostTitleInCanvas(titleB);
		savePage();

		// Make the second tab (active) dirty, then close it -> should prompt.
		setPostTitleInCanvas(titleA);
		cy.tabsExpectUnpinnedUnsavedIndicator(1, true);
		cy.tabsCloseUnpinnedByIndex(1);
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.closeConfirmModalRoot).should(
			'be.visible'
		);

		cy.getByTestId(WORKSPACE_TABS_TEST_ID.closeConfirmCancel).click();
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.closeConfirmModalRoot).should(
			'not.exist'
		);
		cy.tabsExpectUnpinnedCount(2);
		cy.tabsExpectUnpinnedUnsavedIndicator(1, true);
	});

	it('should open the close confirmation modal when closing multiple tabs with unsaved changes (close all without saving)', () => {
		const title0 = `Multi0-${Date.now()}`;
		const title1 = `Multi1-${Date.now()}`;
		const title2 = `Multi2-${Date.now()}`;

		cy.tabsResetWorkspaceStorage();
		createPost({ postType: 'post' });
		cy.tabsExpectUnpinnedCount(1);

		setPostTitleInCanvas(title0);
		savePage();
		cy.tabsExpectUnpinnedUnsavedIndicator(0, false);

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
		setPostTitleInCanvas(title1);
		cy.tabsExpectUnpinnedUnsavedIndicator(1, true);

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(3, { timeout: 60000 });
		setPostTitleInCanvas(title2);
		cy.tabsExpectUnpinnedUnsavedIndicator(2, true);

		// From first tab: close to the right -> targets 2 dirty tabs.
		cy.tabsClickUnpinnedByIndex(0);
		cy.get(unpinnedTabRoots).eq(0).rightclick();
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuCloseToRight).click();

		cy.getByTestId(WORKSPACE_TABS_TEST_ID.closeConfirmModalRoot).should(
			'be.visible'
		);
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.closeConfirmTabsList)
			.should('be.visible')
			.find('.blockera-tabs-close-confirm-tab-item')
			.should('have.length', 2);

		cy.getByTestId(
			WORKSPACE_TABS_TEST_ID.closeConfirmCloseWithoutSaving
		).click();

		cy.getByTestId(WORKSPACE_TABS_TEST_ID.closeConfirmModalRoot).should(
			'not.exist'
		);
		cy.tabsExpectUnpinnedCount(1);
		cy.tabsGetActiveTitle().should('contain.text', title0);
	});
});
