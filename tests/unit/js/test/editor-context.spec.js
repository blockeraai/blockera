/**
 * Internal dependencies
 */
import {
	isEditorPage,
	isPostNewEditorPage,
} from '../../../../packages/global-packages/packages/editor/js/utils/isEditorPage';
import {
	getCurrentEditorContext,
	shouldSkipCompanionTabLimits,
} from '../../../../packages/global-packages/packages/editor/js/tabs/utils/editorContext';
import { isSiteEditorPostType } from '../../../../packages/global-packages/packages/editor/js/hooks/urlUtils';

describe('isEditorPage', () => {
	it('is true for the site editor and post editors', () => {
		window.history.replaceState({}, '', '/wp-admin/site-editor.php');
		expect(isEditorPage()).toBe(true);

		window.history.replaceState(
			{},
			'',
			'/wp-admin/post.php?post=1&action=edit'
		);
		expect(isEditorPage()).toBe(true);

		window.history.replaceState({}, '', '/wp-admin/post-new.php?post_type=page');
		expect(isEditorPage()).toBe(true);
		expect(isPostNewEditorPage()).toBe(true);
	});

	it('is false on other admin screens', () => {
		window.history.replaceState({}, '', '/wp-admin/plugins.php');
		expect(isEditorPage()).toBe(false);
		expect(isPostNewEditorPage()).toBe(false);

		window.history.replaceState({}, '', '/wp-admin/post.php?post=1');
		expect(isEditorPage()).toBe(false);
	});
});

describe('getCurrentEditorContext', () => {
	it('returns site, post, or null from the pathname', () => {
		window.history.replaceState({}, '', '/wp-admin/site-editor.php');
		expect(getCurrentEditorContext()).toBe('site');

		window.history.replaceState({}, '', '/wp-admin/post.php?post=1');
		expect(getCurrentEditorContext()).toBe('post');

		window.history.replaceState({}, '', '/wp-admin/post-new.php');
		expect(getCurrentEditorContext()).toBe('post');

		window.history.replaceState({}, '', '/wp-admin/index.php');
		expect(getCurrentEditorContext()).toBeNull();
	});
});

describe('shouldSkipCompanionTabLimits', () => {
	it('is true only when skipTabLimits is set', () => {
		expect(shouldSkipCompanionTabLimits()).toBe(false);
		expect(shouldSkipCompanionTabLimits({})).toBe(false);
		expect(shouldSkipCompanionTabLimits({ skipTabLimits: false })).toBe(
			false
		);
		expect(shouldSkipCompanionTabLimits({ skipTabLimits: true })).toBe(true);
	});
});

describe('cross-boundary editor types', () => {
	it('treats templates as site editor and pages as post editor', () => {
		expect(isSiteEditorPostType('wp_template')).toBe(true);
		expect(isSiteEditorPostType('page')).toBe(false);
	});
});
