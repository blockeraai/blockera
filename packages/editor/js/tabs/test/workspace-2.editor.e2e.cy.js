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
});
