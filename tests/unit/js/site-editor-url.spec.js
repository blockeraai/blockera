/**
 * Internal dependencies
 */
import {
	SITE_EDITOR_PATH,
	isSiteEditorUrl,
} from '../../../packages/global-packages/packages/utils/js/site-editor';

describe('isSiteEditorUrl', () => {
	const originalHref = window.location.href;

	afterEach(() => {
		window.history.pushState({}, '', originalHref);
	});

	it('exports the Site Editor script path', () => {
		expect(SITE_EDITOR_PATH).toBe('site-editor.php');
	});

	it('returns true when the pathname is the Site Editor', () => {
		window.history.pushState({}, '', '/wp-admin/site-editor.php');

		expect(isSiteEditorUrl()).toBe(true);
	});

	it('returns true for nested Site Editor pathnames', () => {
		window.history.pushState({}, '', '/wp/wp-admin/site-editor.php');

		expect(isSiteEditorUrl()).toBe(true);
	});

	it('returns false for the post editor', () => {
		window.history.pushState({}, '', '/wp-admin/post.php');

		expect(isSiteEditorUrl()).toBe(false);
	});
});
