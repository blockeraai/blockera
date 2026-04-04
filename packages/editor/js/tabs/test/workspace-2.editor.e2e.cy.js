/**
 * End-to-end tests for Blockera workspace tabs — reloads, REST, and Pro limits
 * (split from UI spec to reduce Chrome renderer memory pressure in CI).
 *
 * @see workspace-1.editor.e2e.cy.js — tab title, rename, pin, view/copy links
 */
import {
	createPost,
	savePage,
	closeWelcomeGuide,
} from '@blockera/dev-cypress/js/helpers';
import { WORKSPACE_TABS_TEST_ID } from 'blockera-editor-tabs-test-ids';

import { setPostTitleInCanvas } from './workspace-e2e-helpers';

describe('Blockera workspace tabs (workflows)', () => {
	describe('Recently closed tabs', () => {
		const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

		const waitAfterEditorReload = () => {
			// Mirror createPost: editor boot + welcome guide.
			cy.wait(2000);
			closeWelcomeGuide();
			cy.get('.blockera-tabs-bar', { timeout: 60000 }).should(
				'be.visible'
			);
		};

		it('should add a closed tab to Recently Closed and reopen it when clicked', () => {
			const titleClosed = `RcClosed-${Date.now()}`;
			const titleKept = `RcKept-${Date.now()}`;

			cy.tabsResetTabsRelatedStorage();
			createPost({ postType: 'post' });
			cy.tabsExpectUnpinnedCount(1);

			setPostTitleInCanvas(titleClosed);

			cy.get(unpinnedTabRoots)
				.eq(0)
				.invoke('attr', 'test-id')
				.then((testId) => {
					const prefix = WORKSPACE_TABS_TEST_ID.tabRootPrefix;
					expect(testId?.startsWith(prefix)).to.be.true;
					cy.wrap(testId.slice(prefix.length)).as('closedTabKey');
				});

			cy.tabsAddNewPost();
			cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
			setPostTitleInCanvas(titleKept);

			cy.tabsClickUnpinnedByIndex(0);
			savePage();
			cy.tabsClickUnpinnedByIndex(1);
			savePage();

			cy.tabsCloseUnpinnedByIndex(0);
			cy.tabsExpectUnpinnedCount(1);

			cy.get('@closedTabKey').then((closedTabKey) => {
				cy.tabsOpenToolbarMenu();
				cy.getByTestId(
					WORKSPACE_TABS_TEST_ID.recentlyClosedItem(closedTabKey)
				)
					.should('be.visible')
					.should('contain.text', titleClosed);

				cy.getByTestId(
					WORKSPACE_TABS_TEST_ID.recentlyClosedItem(closedTabKey)
				).click();
			});

			cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
			cy.tabsGetActiveTitle().should('contain.text', titleClosed);
		});

		it('should not record closed tabs when “Remember recently closed” is off, then work again when re-enabled', () => {
			const t1 = `RcOff1-${Date.now()}`;
			const t2 = `RcOff2-${Date.now()}`;
			const t3 = `RcOn3-${Date.now()}`;
			const t4 = `RcOn4-${Date.now()}`;

			cy.tabsResetTabsRelatedStorage();
			createPost({ postType: 'post' });
			cy.tabsExpectUnpinnedCount(1);
			setPostTitleInCanvas(t1);

			cy.tabsAddNewPost();
			cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
			setPostTitleInCanvas(t2);

			cy.tabsClickUnpinnedByIndex(0);
			savePage();
			cy.tabsClickUnpinnedByIndex(1);
			savePage();

			// Same effect as toolbar “Remember recently closed tabs” off (read at editor boot).
			cy.window().then((win) => {
				win.localStorage.setItem(
					'blockera-tabs-recently-closed-persistence',
					JSON.stringify(false)
				);
				win.localStorage.removeItem('blockera-tabs-recently-closed');
			});
			cy.reload();
			waitAfterEditorReload();

			cy.tabsExpectUnpinnedCount(2);
			cy.tabsCloseUnpinnedByIndex(0);
			cy.tabsExpectUnpinnedCount(1);

			cy.window().then((win) => {
				expect(
					win.localStorage.getItem('blockera-tabs-recently-closed'),
					'recently closed list should not be persisted when disabled'
				).to.be.null;
			});

			cy.window().then((win) => {
				win.localStorage.setItem(
					'blockera-tabs-recently-closed-persistence',
					JSON.stringify(true)
				);
			});
			cy.reload();
			waitAfterEditorReload();

			cy.tabsExpectUnpinnedCount(1);

			cy.tabsAddNewPost();
			cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });

			cy.tabsClickUnpinnedByIndex(0);
			setPostTitleInCanvas(t3);

			cy.tabsClickUnpinnedByIndex(1);
			setPostTitleInCanvas(t4);

			cy.tabsClickUnpinnedByIndex(0);
			savePage();
			cy.tabsClickUnpinnedByIndex(1);
			savePage();

			// Close the tab that shows t3 (order can differ after restore); capture key from that root.
			cy.get(unpinnedTabRoots)
				.contains(t3, { matchCase: false })
				.closest(`[test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`)
				.as('tabRootWithT3');
			cy.get('@tabRootWithT3')
				.invoke('attr', 'test-id')
				.then((testId) => {
					const prefix = WORKSPACE_TABS_TEST_ID.tabRootPrefix;
					expect(testId?.startsWith(prefix)).to.be.true;
					cy.wrap(testId.slice(prefix.length)).as('closedTabKey');
				});
			cy.get('@tabRootWithT3')
				.find('[test-id^="blockera-workspace-tabs-close--"]')
				.should('be.visible')
				.click();

			cy.tabsExpectUnpinnedCount(1);

			cy.get('@closedTabKey').then((closedTabKey) => {
				cy.tabsOpenToolbarMenu();
				cy.getByTestId(
					WORKSPACE_TABS_TEST_ID.recentlyClosedItem(closedTabKey),
					{ timeout: 30000 }
				)
					.should('be.visible')
					.should('contain.text', t3);
			});

			// Revert storage default for other specs in this file.
			cy.window().then((win) => {
				win.localStorage.removeItem(
					'blockera-tabs-recently-closed-persistence'
				);
			});
		});
	});

	describe('Bulk edit (open multiple docs in tabs)', () => {
		const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

		/**
		 * `BulkActions` registers the posts list bulk action “Edit All in Editor”
		 * (`blockera_edit_all`), which redirects to the editor with `bulk_edit_ids`.
		 * `capture_bulk_edit_ids` seeds sessionStorage before the editor boots;
		 * `useBulkEditTabs` opens each ID as a tab.
		 *
		 * @see packages/editor/php/BulkActions.php
		 * @see packages/editor/js/tabs/hooks/useBulkEditTabs.ts
		 * @see packages/dev-cypress/js/support/commands.js — tabsBulkEditAllInEditorFromPostsList
		 */
		it('should open two tabs when using posts list bulk action Edit All in Editor', () => {
			const titleA = `BulkA-${Date.now()}`;
			const titleB = `BulkB-${Date.now()}`;

			cy.tabsResetWorkspaceStorage();
			createPost({ postType: 'post' });
			cy.get('.blockera-tabs-bar', { timeout: 60000 }).should(
				'be.visible'
			);
			cy.tabsExpectUnpinnedCount(1);

			setPostTitleInCanvas(titleA);
			savePage();

			cy.url().should('include', 'post=');
			cy.url().then((href) => {
				const m = href.match(/post=(\d+)/);
				expect(m, 'editor URL should include post id').to.be.ok;
				const id1 = parseInt(m[1], 10);

				cy.tabsCreateDraftPostsViaRest(1).then((ids) => {
					expect(ids.length).to.equal(1);
					const id2 = ids[0];

					cy.window().then((win) => {
						return win.wp.apiFetch({
							path: `/wp/v2/posts/${id2}`,
							method: 'POST',
							data: { title: titleB },
						});
					});

					cy.tabsBulkEditAllInEditorFromPostsList([id1, id2]);
				});
			});

			cy.wait(2000);
			closeWelcomeGuide();
			cy.get('.blockera-tabs-bar', { timeout: 60000 }).should(
				'be.visible'
			);

			cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });

			// Order of IDs in the admin list + `bulk_edit_ids` is WP-dependent; assert both docs opened.
			cy.get(unpinnedTabRoots)
				.contains(titleA, { matchCase: false })
				.should('be.visible');
			cy.get(unpinnedTabRoots)
				.contains(titleB, { matchCase: false })
				.should('be.visible');

			cy.get(unpinnedTabRoots)
				.contains(titleA, { matchCase: false })
				.click();
			cy.tabsGetActiveTitle().should('contain.text', titleA);

			cy.get(unpinnedTabRoots)
				.contains(titleB, { matchCase: false })
				.click();
			cy.tabsGetActiveTitle().should('contain.text', titleB);
		});
	});

	describe('Pro version limitations (free tier)', () => {
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
			cy.getByTestId(
				WORKSPACE_TABS_TEST_ID.tabsLimitUpgradePrompt
			).should('contain.text', 'More pinned tabs in Pro');
		});

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
					cy.wrap(testId.slice(prefix.length)).as(
						'reopenWhenAtLimitKey'
					);
				});

			cy.tabsCloseUnpinnedByIndex(0);
			cy.tabsExpectUnpinnedCount(2);

			cy.tabsAddNewPost();
			cy.tabsExpectUnpinnedCount(3, { timeout: 60000 });
			setPostTitleInCanvas(t4);
			saveAllThreeUnpinned();

			cy.get('@reopenWhenAtLimitKey').then((tabKey) => {
				cy.tabsOpenToolbarMenu();
				cy.getByTestId(
					WORKSPACE_TABS_TEST_ID.recentlyClosedItem(tabKey),
					{ timeout: 20000 }
				)
					.should('be.visible')
					.click();
			});

			cy.tabsExpectUnpinnedCount(3, { timeout: 60000 });
			cy.tabsExpectLimitUpgradePrompt({ timeout: 30000 });
			cy.getByTestId(
				WORKSPACE_TABS_TEST_ID.tabsLimitUpgradePrompt
			).should('contain.text', 'More open tabs in Pro');
		});

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
					.closest(
						`[test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`
					)
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
});
