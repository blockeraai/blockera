/**
 * End-to-end tests for Blockera workspace tabs (multi-document tab bar).
 *
 * Selectors: `test-id` values from `packages/editor/js/tabs/constants/testIds.ts`
 * (Cypress: `cy.getByTestId`, `cy.tabs*` — e.g. `tabsExpectUnpinnedCount`,
 * `tabsExpectPinnedCount`, `tabsClickUnpinnedByIndex`, `tabsClickPinnedByIndex`,
 * `tabsExpectUnpinnedUnsavedIndicator`, `tabsResetWorkspaceStorage`,
 * `tabsResetTabsRelatedStorage`, `tabsOpenToolbarMenu`, `tabsStubWindowOpen`,
 * `tabsStubClipboardWrite`).
 *
 * Blockera dependencies
 */
import {
	createPost,
	savePage,
	closeWelcomeGuide,
} from '@blockera/dev-cypress/js/helpers';
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

	describe('Tab title', () => {
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
			cy.getByTestId(
				WORKSPACE_TABS_TEST_ID.contextMenuCloseToRight
			).click();
			cy.tabsExpectUnpinnedCount(1);
			cy.get(unpinnedTabRoots)
				.eq(0)
				.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
				.should('contain.text', toRightTitles.t0);
			cy.tabsGetActiveTitle().should('contain.text', toRightTitles.t0);

			// 3) Close others — keep the middle tab; remove the other unpinned tabs.
			const othersTitles = openThreeUnpinnedTabs('Others');
			cy.get(unpinnedTabRoots).eq(1).rightclick();
			cy.getByTestId(
				WORKSPACE_TABS_TEST_ID.contextMenuCloseOthers
			).click();
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
	});

	describe('Tab rename', () => {
		const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

		/**
		 * Fill Rename Tab modal and save.
		 *
		 * @param {string} customTitle
		 */
		const saveRenameModal = (customTitle) => {
			cy.getByTestId(WORKSPACE_TABS_TEST_ID.renameModal).should(
				'be.visible'
			);
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
			cy.getByTestId(
				WORKSPACE_TABS_TEST_ID.renameModalRemoveRename
			).click();
			cy.get(unpinnedTabRoots)
				.eq(0)
				.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`)
				.should('contain.text', titleA);
		});
	});

	describe('Pin and unpin', () => {
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
						$el.is(':disabled') ||
							$el.attr('aria-disabled') === 'true',
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

	describe('View and copy links', () => {
		const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

		/**
		 * View opens the permalink; copy actions mirror `useEntity` viewUrl / editorUrl.
		 *
		 * @see packages/editor/js/tabs/components/TabContextMenu.tsx — View, Copy view link, Copy editor link
		 * @see packages/editor/js/hooks/useEntity.ts — viewUrl (link), editorUrl (getEditorUrl)
		 */
		it('should open View and copy view and editor links from the tab context menu', () => {
			createPost({ postType: 'post' });
			cy.tabsExpectUnpinnedCount(1);

			setPostTitleInCanvas(`ViewLinks-${Date.now()}`);
			savePage();

			cy.tabsStubWindowOpen();
			cy.tabsStubClipboardWrite();

			cy.get(unpinnedTabRoots).eq(0).rightclick();
			cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuView)
				.should('be.visible')
				.and('not.have.attr', 'aria-disabled', 'true')
				.click();

			cy.get('@tabsWindowOpen')
				.should('have.been.calledOnce')
				.its('firstCall.args.0')
				.should('be.a', 'string')
				.and('match', /^https?:\/\//);

			cy.get('@tabsWindowOpen').then((stub) => {
				cy.wrap(stub.firstCall.args[0]).as('expectedViewUrl');
			});

			cy.get(unpinnedTabRoots).eq(0).rightclick();
			cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuCopyViewLink)
				.should('be.visible')
				.and('not.have.attr', 'aria-disabled', 'true')
				.click();

			cy.get('@expectedViewUrl').then((expectedViewUrl) => {
				cy.get('@tabsClipboardWrite').should(
					'have.been.calledWith',
					expectedViewUrl
				);
			});

			cy.get('@tabsClipboardWrite').invoke('resetHistory');

			cy.url().then((href) => {
				const m = href.match(/post=(\d+)/);
				expect(m, 'editor URL should include post id').to.be.ok;
				cy.wrap(m[1]).as('postId');
			});

			cy.get(unpinnedTabRoots).eq(0).rightclick();
			cy.getByTestId(WORKSPACE_TABS_TEST_ID.contextMenuCopyEditorLink)
				.should('be.visible')
				.and('not.have.attr', 'aria-disabled', 'true')
				.click();

			cy.get('@tabsClipboardWrite').should('have.been.calledOnce');
			cy.get('@postId').then((postId) => {
				cy.get('@tabsClipboardWrite').should(
					'have.been.calledWith',
					Cypress.sinon.match(
						(url) =>
							typeof url === 'string' &&
							url.includes(`post=${postId}`) &&
							url.includes('action=edit')
					)
				);
			});
		});
	});

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
});
