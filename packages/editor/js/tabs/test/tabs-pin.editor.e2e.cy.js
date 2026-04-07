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

describe('Workspace tabs: Pin', () => {
	const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;
	const pinnedTabRoots = `.blockera-tabs-bar-tabs__pinned-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

	/**
	 * Pinned strip renders first; pinning the middle tab moves it left of the
	 * remaining unpinned tabs. Toolbar offers “Icon-only pinned tabs”; tab menu
	 * uses Pin/Unpin and disables Close while pinned.
	 *
	 * @see packages/editor/js/tabs/hooks/useTabs.ts — pinTab / unpinTab
	 * @see packages/editor/js/tabs/components/TabContextMenu.tsx
	 * @see packages/editor/js/tabs/components/ToolbarContextMenu.tsx
	 */
	it('should pin the second of three tabs to the pinned strip, cover pin-related UI, then unpin', () => {
		const title0 = `Pin0-${Date.now()}`;
		const title1 = `Pin1-${Date.now()}`;
		const title2 = `Pin2-${Date.now()}`;

		createPost({ postType: 'post' });
		cy.tabsExpectUnpinnedCount(1);
		cy.tabsExpectPinnedCount(0);

		setPostTitleInCanvas(title0);

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
		setPostTitleInCanvas(title1);

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(3, { timeout: 60000 });
		setPostTitleInCanvas(title2);

		// Pin the second tab (index 1) while the third tab is active.
		cy.get(unpinnedTabRoots).eq(1).rightclick();
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuPin).click();

		cy.tabsExpectPinnedCount(1);
		cy.tabsExpectUnpinnedCount(2);

		cy.get(pinnedTabRoots)
			.first()
			.should('have.class', 'is-pinned')
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('contain.text', title1);

		cy.get(unpinnedTabRoots)
			.eq(0)
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('contain.text', title0);
		cy.get(unpinnedTabRoots)
			.eq(1)
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('contain.text', title2);

		// Pinned tabs cannot be closed from the tab menu.
		cy.get(pinnedTabRoots).first().rightclick();
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuClose).should(
			($el) => {
				expect(
					$el.is(':disabled') || $el.attr('aria-disabled') === 'true',
					'Close must be disabled while tab is pinned'
				).to.be.true;
			}
		);
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuUnpin).should(
			'be.visible'
		);
		cy.get('body').type('{esc}', { force: true });

		// Toolbar: Icon-only pinned tabs (hide title, show icon on pinned strip).
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.toolbarMenuTrigger)
			.filter(':visible')
			.first()
			.click({ force: true });
		cy.getByTestId(
			WORKSPACE_TABS_TEST_ID.toolbarIconOnlyPinnedTabs
		).click();
		cy.get(pinnedTabRoots)
			.first()
			.should('have.class', 'is-icon-only')
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('not.exist');

		cy.getByTestId(WORKSPACE_TABS_TEST_ID.toolbarMenuTrigger)
			.filter(':visible')
			.first()
			.click({ force: true });
		cy.getByTestId(
			WORKSPACE_TABS_TEST_ID.toolbarIconOnlyPinnedTabs
		).click();
		cy.get(pinnedTabRoots)
			.first()
			.should('not.have.class', 'is-icon-only')
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('contain.text', title1);

		cy.get(pinnedTabRoots).first().rightclick();
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuUnpin).click();

		cy.tabsExpectPinnedCount(0);
		cy.tabsExpectUnpinnedCount(3);

		// Unpinned tab is prepended after unpin (middle tab becomes first).
		cy.get(unpinnedTabRoots)
			.eq(0)
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('contain.text', title1);
		cy.get(unpinnedTabRoots)
			.eq(1)
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('contain.text', title0);
		cy.get(unpinnedTabRoots)
			.eq(2)
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
			.should('contain.text', title2);
	});
});
