/**
 * End-to-end tests: workspace tabs when a document no longer exists or cannot be loaded
 * (deleted from REST while another tab is active; recently closed entry after delete).
 *
 * Selectors: `packages/editor/js/tabs/constants/testIds.ts` — use `cy.getByTestId`.
 *
 * @see packages/editor/js/tabs/hooks/useSwitchDocument.ts — `ensurePostEntityAccessible`
 * @see packages/editor/js/tabs/components/TabUnavailableModal.tsx
 */
import { createPost, savePage } from '@blockera/dev-cypress/js/helpers';
import { WORKSPACE_TABS_TEST_ID } from 'blockera-editor-tabs-test-ids';

import { setPostTitleInCanvas } from './workspace-e2e-helpers';

describe('Blockera workspace tabs (inaccessible document)', () => {
	const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

	const readTabKeyFromUnpinnedIndex = (index) => {
		return cy
			.get(unpinnedTabRoots)
			.eq(index)
			.invoke('attr', 'test-id')
			.then((testId) => {
				const prefix = WORKSPACE_TABS_TEST_ID.tabRootPrefix;
				expect(testId, 'tab root test-id').to.be.a('string');
				expect(
					testId.startsWith(prefix),
					`expected test-id to start with ${prefix}`
				).to.be.true;
				return testId.slice(prefix.length);
			});
	};

	it('should show the unavailable modal and remove the tab when switching to a deleted post', () => {
		const titleA = `InaccA-${Date.now()}`;
		const titleB = `InaccB-${Date.now()}`;

		cy.tabsResetTabsRelatedStorage();
		createPost({ postType: 'post' });
		cy.tabsExpectUnpinnedCount(1);
		setPostTitleInCanvas(titleA);

		readTabKeyFromUnpinnedIndex(0).as('tabKeyA');

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
		setPostTitleInCanvas(titleB);

		cy.tabsClickUnpinnedByIndex(0);
		savePage();
		cy.tabsClickUnpinnedByIndex(1);
		savePage();

		cy.tabsClickUnpinnedByIndex(1);

		// Trash must finish (and invalidate core-data cache) before clicking the stale tab.
		cy.get('@tabKeyA').then((tabKeyA) => {
			cy.tabsTrashPostByTabKey(tabKeyA);
			cy.tabsClickUnpinnedByIndex(0);
		});

		cy.getByTestId(WORKSPACE_TABS_TEST_ID.unavailableModalRoot, {
			timeout: 30000,
		}).should('be.visible');

		cy.getByTestId(WORKSPACE_TABS_TEST_ID.unavailableModalConfirm)
			.should('be.visible')
			.click();

		cy.getByTestId(WORKSPACE_TABS_TEST_ID.unavailableModalRoot).should(
			'not.exist'
		);

		cy.tabsExpectUnpinnedCount(1);
		cy.tabsGetActiveTitle().should('contain.text', titleB);
	});

	it('should not offer a recently closed row after that post was permanently deleted', () => {
		const titleA = `RcDelA-${Date.now()}`;
		const titleB = `RcDelB-${Date.now()}`;

		cy.tabsResetTabsRelatedStorage();
		createPost({ postType: 'post' });
		cy.tabsExpectUnpinnedCount(1);
		setPostTitleInCanvas(titleA);

		readTabKeyFromUnpinnedIndex(0).as('tabKeyA');

		cy.tabsAddNewPost();
		cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
		setPostTitleInCanvas(titleB);

		cy.tabsClickUnpinnedByIndex(0);
		savePage();
		cy.tabsClickUnpinnedByIndex(1);
		savePage();

		cy.tabsCloseUnpinnedByIndex(0);
		cy.tabsExpectUnpinnedCount(1);

		cy.get('@tabKeyA').then((closedKey) => {
			cy.tabsOpenToolbarMenu();
			cy.getByTestId(
				WORKSPACE_TABS_TEST_ID.recentlyClosedItem(closedKey)
			).should('be.visible');

			cy.get('.interface-interface-skeleton__body', {
				timeout: 10000,
			})
				.first()
				.click({ force: true });

			cy.tabsTrashPostByTabKey(closedKey);

			cy.tabsOpenToolbarMenu();

			const closedItemTestId =
				WORKSPACE_TABS_TEST_ID.recentlyClosedItem(closedKey);
			cy.get('body').should(($body) => {
				expect(
					$body.find(`[test-id="${closedItemTestId}"]`).length,
					'recently closed row removed after post deleted'
				).to.eq(0);
			});
		});
	});
});
