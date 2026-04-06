/**
 * End-to-end tests for Blockera workspace tabs — post ↔ site editor URL and entity
 * when switching template tabs (see useSwitchDocument replaceState guard).
 *
 * @see workspace-1.editor.e2e.cy.js — tab bar UI
 * @see workspace-2.editor.e2e.cy.js — workflows, bulk edit
 *
 * Selectors: {@link WORKSPACE_TABS_TEST_ID}, `cy.tabs*`, `cy.expectCoreEditorPostType`.
 * Requires a block theme (`/wp/v2/templates`).
 *
 * Note: After switching back to a post tab, `core/editor` updates before the
 * pathname may leave `site-editor.php` in slow/headless runs; we assert post
 * type for that transition and pathname when the template tab is active.
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';
import { WORKSPACE_TABS_TEST_ID } from 'blockera-editor-tabs-test-ids';

describe('Blockera workspace tabs (cross-boundary URL)', () => {
	const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

	it('should align site-editor URL and editor entity when switching post ↔ template tabs', () => {
		cy.tabsResetWorkspaceStorage();
		createPost({ postType: 'post' });
		cy.get('.blockera-tabs-bar', { timeout: 60000 }).should('be.visible');
		cy.tabsExpectUnpinnedCount(1);
		cy.location('pathname', { timeout: 60000 }).should((pathname) => {
			expect(pathname).to.satisfy(
				(p) =>
					String(p).includes('post.php') ||
					String(p).includes('post-new.php')
			);
		});
		cy.expectCoreEditorPostType('post');

		cy.tabsRestGetSampleTemplate().then((tpl) => {
			expect(tpl.slug, 'template slug').to.be.a('string').and.not.be
				.empty;
			cy.tabsAddTabFromPaletteSearch(tpl.slug);
		});

		cy.tabsExpectUnpinnedCount(2, { timeout: 60000 });
		cy.location('pathname', { timeout: 30000 }).should(
			'include',
			'site-editor.php'
		);
		cy.expectCoreEditorPostType('wp_template');

		cy.tabsClickUnpinnedTabMatchingTestId('tab--post-');
		cy.expectCoreEditorPostType('post');

		cy.tabsClickUnpinnedTabMatchingTestId('tab--wp_template');
		cy.expectCoreEditorPostType('wp_template');
		cy.location('pathname', { timeout: 45000 }).should(
			'include',
			'site-editor.php'
		);

		cy.tabsClickUnpinnedTabMatchingTestId('tab--post-');
		cy.expectCoreEditorPostType('post');

		cy.tabsClickUnpinnedTabMatchingTestId('tab--wp_template');
		cy.expectCoreEditorPostType('wp_template');
		cy.location('pathname', { timeout: 30000 }).should(
			'include',
			'site-editor.php'
		);

		cy.get(unpinnedTabRoots).should('have.length', 2);
	});
});
