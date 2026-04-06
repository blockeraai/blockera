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

describe('Workspace tabs: view/copy links', () => {
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
