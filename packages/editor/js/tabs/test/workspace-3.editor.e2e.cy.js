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
});
