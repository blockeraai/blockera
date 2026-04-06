/**
 * Pro regular-tab limit + reopen from Recently closed — one spec per file for CI.
 *
 * @see workspace-limit-1.editor.e2e.cy.js
 * @see workspace-limit-3.editor.e2e.cy.js
 */
import { createPost, savePage } from '@blockera/dev-cypress/js/helpers';
import { WORKSPACE_TABS_TEST_ID } from 'blockera-editor-tabs-test-ids';

import { setPostTitleInCanvas } from './workspace-e2e-helpers';

describe('Blockera workspace tabs — Pro limits (free tier)', () => {
	const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

	/**
	 * Default unpinned tab limit is 3 (`resolveTabsConfig`). Reopening from
	 * “Recently closed” calls `addTab` without eviction (`handleReopenTab`), so
	 * with three tabs already open the next add is blocked (`regular`).
	 *
	 * (Bulk-edit + REST is brittle in Cypress; this matches real UX.)
	 *
	 * @see packages/editor/js/tabs/components/TabsManager.tsx — handleReopenTab
	 * @see packages/editor/js/tabs/hooks/useTabs.ts — addTab (blocked)
	 */
	it('should show the upgrade prompt when opening a fourth regular tab exceeds the free limit', () => {
		const t1 = `Reg4a-${Date.now()}`;
		const t2 = `Reg4b-${Date.now()}`;
		const t3 = `Reg4c-${Date.now()}`;
		const t4 = `Reg4d-${Date.now()}`;

		const saveAllThreeUnpinned = () => {
			cy.tabsClickUnpinnedByIndex(0);
			savePage();
			cy.tabsClickUnpinnedByIndex(1);
			savePage();
			cy.tabsClickUnpinnedByIndex(2);
			savePage();
		};

		cy.tabsResetWorkspaceStorage();
		cy.tabsResetTabsRelatedStorage();
		createPost({ postType: 'post' });
		cy.tabsExpectUnpinnedCount(1);

		setPostTitleInCanvas(t1);

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
		setPostTitleInCanvas(t2);

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(3, { timeout: 60000 });
		setPostTitleInCanvas(t3);

		saveAllThreeUnpinned();

		cy.get(unpinnedTabRoots)
			.eq(0)
			.invoke('attr', 'test-id')
			.then((testId) => {
				const prefix = WORKSPACE_TABS_TEST_ID.tabRootPrefix;
				expect(testId?.startsWith(prefix)).to.be.true;
				cy.wrap(testId.slice(prefix.length)).as('reopenWhenAtLimitKey');
			});

		cy.tabsCloseUnpinnedByIndex(0);
		cy.tabsExpectUnpinnedCount(2);

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(3, { timeout: 60000 });
		setPostTitleInCanvas(t4);
		saveAllThreeUnpinned();

		cy.get('@reopenWhenAtLimitKey').then((tabKey) => {
			cy.tabsOpenToolbarMenu();
			cy.getByTestId(WORKSPACE_TABS_TEST_ID.recentlyClosedItem(tabKey), {
				timeout: 20000,
			})
				.should('be.visible')
				.click();
		});

		cy.tabsExpectUnpinnedCount(3, { timeout: 60000 });
		cy.tabsExpectLimitUpgradePrompt({ timeout: 30000 });
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.tabsLimitUpgradePrompt).should(
			'contain.text',
			'More open tabs in Pro'
		);
	});
});
