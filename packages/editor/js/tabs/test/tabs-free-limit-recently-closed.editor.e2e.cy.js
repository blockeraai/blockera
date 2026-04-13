/**
 * Recently closed list cap — one spec per file for CI.
 *
 * @see workspace-limit-1.editor.e2e.cy.js
 * @see workspace-limit-2.editor.e2e.cy.js
 */
import { createPost, savePage } from '@blockera/dev-cypress/js/helpers';
import { WORKSPACE_TABS_TEST_ID } from 'blockera-editor-tabs-test-ids';

import { setPostTitleInCanvas } from './workspace-e2e-helpers';

describe('Workspace tabs: Recently closed limit (free tier)', () => {
	const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

	/**
	 * Recently closed list is capped (default 3) by slicing; there is no
	 * upgrade modal for this limit — oldest entries drop when exceeded.
	 *
	 * @see packages/editor/js/tabs/hooks/useRecentlyClosedTabs.ts — addClosedTab
	 * @see packages/editor/js/tabs/utils/tabsConfig.ts — limits.recentlyClosed
	 */
	it('should keep at most three entries in Recently closed and drop the oldest when a fourth tab is closed', () => {
		const t1 = `RcCap1-${Date.now()}`;
		const t2 = `RcCap2-${Date.now()}`;
		const t3 = `RcCap3-${Date.now()}`;
		const t4 = `RcCap4-${Date.now()}`;
		const t5 = `RcCap5-${Date.now()}`;
		const t6 = `RcCap6-${Date.now()}`;

		const saveAllUnpinnedTabs = () => {
			cy.tabsClickUnpinnedByIndex(0);
			savePage();
			cy.tabsClickUnpinnedByIndex(1);
			savePage();
			cy.tabsClickUnpinnedByIndex(2);
			savePage();
		};

		const closeTabByTitle = (title) => {
			cy.get(unpinnedTabRoots)
				.contains(title, { matchCase: false })
				.closest(`[test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`)
				.find('[test-id^="blockera-workspace-tabs-close--"]')
				.should('be.visible')
				.click();
		};

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

		saveAllUnpinnedTabs();

		cy.get(unpinnedTabRoots)
			.contains(t1, { matchCase: false })
			.closest(`[test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`)
			.invoke('attr', 'test-id')
			.then((testId) => {
				const prefix = WORKSPACE_TABS_TEST_ID.tabRootPrefix;
				expect(testId?.startsWith(prefix)).to.be.true;
				cy.wrap(testId.slice(prefix.length)).as('oldestClosedKey');
			});

		closeTabByTitle(t1);
		cy.tabsExpectUnpinnedCount(2);

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(3, { timeout: 60000 });
		setPostTitleInCanvas(t4);
		saveAllUnpinnedTabs();

		closeTabByTitle(t2);
		cy.tabsExpectUnpinnedCount(2);

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(3, { timeout: 60000 });
		setPostTitleInCanvas(t5);
		saveAllUnpinnedTabs();

		closeTabByTitle(t3);
		cy.tabsExpectUnpinnedCount(2);

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(3, { timeout: 60000 });
		setPostTitleInCanvas(t6);
		saveAllUnpinnedTabs();

		closeTabByTitle(t4);

		cy.tabsExpectUnpinnedCount(2);

		cy.get('@oldestClosedKey').then((oldestKey) => {
			cy.tabsOpenToolbarMenu();
			cy.get(
				`[test-id^="blockera-workspace-tabs-recently-closed-item--"]`,
				{ timeout: 20000 }
			).should('have.length', 3);
			cy.getByTestId(
				WORKSPACE_TABS_TEST_ID.recentlyClosedItem(oldestKey)
			).should('not.exist');
			cy.get('body').type('{esc}', { force: true });
		});
	});
});
