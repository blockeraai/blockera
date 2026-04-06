/**
 * Pro pinned-tab limit (free tier) — one spec per file to limit Chrome renderer
 * memory in CI.
 *
 * @see workspace-limit-2.editor.e2e.cy.js
 * @see workspace-limit-3.editor.e2e.cy.js
 * @see workspace-1.editor.e2e.cy.js — tab title, rename, pin, view/copy links
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';
import { WORKSPACE_TABS_TEST_ID } from 'blockera-editor-tabs-test-ids';

import { setPostTitleInCanvas } from './workspace-e2e-helpers';

describe('Blockera workspace tabs — Pro limits (free tier)', () => {
	const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

	/**
	 * Default pinned tab limit is 1 (`resolveTabsConfig`). With Pro active,
	 * `blockera.editor.tabs` raises limits and this prompt does not appear.
	 *
	 * @see packages/editor/js/tabs/utils/tabsConfig.ts
	 * @see packages/editor/js/tabs/hooks/useTabs.ts — pinTab / togglePinTab
	 * @see packages/editor/js/tabs/components/TabsBar.tsx — UpgradePrompt
	 */
	it('should show the upgrade prompt when pinning a second tab exceeds the free pinned limit', () => {
		const title0 = `Lim0-${Date.now()}`;
		const title1 = `Lim1-${Date.now()}`;

		cy.tabsResetWorkspaceStorage();
		createPost({ postType: 'post' });
		cy.tabsExpectUnpinnedCount(1);
		cy.tabsExpectPinnedCount(0);

		setPostTitleInCanvas(title0);

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
		setPostTitleInCanvas(title1);

		cy.get(unpinnedTabRoots).eq(0).rightclick();
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuPin).click();
		cy.tabsExpectPinnedCount(1);
		cy.tabsExpectUnpinnedCount(1);

		cy.get(unpinnedTabRoots).eq(0).rightclick();
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuPin).click();

		cy.tabsExpectPinnedCount(1);
		cy.tabsExpectUnpinnedCount(1);
		cy.tabsExpectLimitUpgradePrompt({ timeout: 20000 });
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.tabsLimitUpgradePrompt).should(
			'contain.text',
			'More pinned tabs in Pro'
		);
	});
});
