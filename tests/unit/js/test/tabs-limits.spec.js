/**
 * External dependencies
 */
import { addFilter, removeAllFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import {
	hasReachedLimit,
	resolveTabsConfig,
} from '../../../../packages/global-packages/packages/editor/js/tabs/utils/tabsConfig';
import {
	SITE_EDITOR_VIEW_MODE_TOGGLE_SELECTOR,
	markSiteEditorViewModeToggleNavigation,
	consumeSiteEditorViewModeToggleBypass,
	isSiteEditorViewModeToggleClick,
} from '../../../../packages/global-packages/packages/editor/js/tabs/utils/siteEditorViewModeToggle';

describe('hasReachedLimit', () => {
	it('compares a finite limit and ignores Infinity / non-finite caps', () => {
		expect(hasReachedLimit(3, 3)).toBe(true);
		expect(hasReachedLimit(2, 3)).toBe(false);
		expect(hasReachedLimit(10, Infinity)).toBe(false);
		expect(hasReachedLimit(1, Number.NaN)).toBe(false);
	});
});

describe('resolveTabsConfig', () => {
	afterEach(() => {
		removeAllFilters('blockera.editor.tabs');
	});

	it('returns the default companion limits', () => {
		expect(resolveTabsConfig()).toEqual({
			limits: {
				regular: 3,
				recentlyClosed: 3,
				pinned: 1,
			},
		});
	});

	it('normalizes filter overrides: floor, negative as unlimited, invalid as fallback', () => {
		addFilter('blockera.editor.tabs', 'test', () => ({
			limits: {
				regular: 4.8,
				recentlyClosed: -1,
				pinned: 'nope',
			},
		}));

		expect(resolveTabsConfig().limits).toEqual({
			regular: 4,
			recentlyClosed: Infinity,
			pinned: 1,
		});
	});
});

describe('site editor view-mode toggle bypass', () => {
	beforeEach(() => {
		while (consumeSiteEditorViewModeToggleBypass()) {
			// Drain any leftover single-use flag from a previous test.
		}
	});

	it('consumes the pending bypass exactly once', () => {
		expect(consumeSiteEditorViewModeToggleBypass()).toBe(false);

		markSiteEditorViewModeToggleNavigation();
		expect(consumeSiteEditorViewModeToggleBypass()).toBe(true);
		expect(consumeSiteEditorViewModeToggleBypass()).toBe(false);
	});

	it('detects clicks inside the view-mode toggle control', () => {
		const toggle = document.createElement('div');
		toggle.className = SITE_EDITOR_VIEW_MODE_TOGGLE_SELECTOR.slice(1);
		const child = document.createElement('span');
		toggle.appendChild(child);
		document.body.appendChild(toggle);

		expect(isSiteEditorViewModeToggleClick(child)).toBe(true);
		expect(isSiteEditorViewModeToggleClick(document.body)).toBe(false);
		expect(isSiteEditorViewModeToggleClick(null)).toBe(false);

		toggle.remove();
	});
});
