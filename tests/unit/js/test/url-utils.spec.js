/**
 * Keep these helpers off the @wordpress/editor graph so the suite stays fast
 * and does not re-register core stores in jsdom.
 */
jest.mock('@wordpress/api-fetch', () => jest.fn());
jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));
jest.mock('@wordpress/core-data', () => ({
	store: 'core',
}));
jest.mock('@wordpress/editor', () => ({
	store: 'core/editor',
}));

/**
 * Internal dependencies
 */
import {
	isSiteEditorPostType,
	getAdminBaseUrl,
	getEditorUrl,
	isValidUrl,
	appendQueryParams,
	parseTemplateSlug,
	buildTemplatePartPreviewUrl,
} from '../../../../packages/global-packages/packages/editor/js/hooks/urlUtils';
import { isTemplateAutosavePreviewType } from '../../../../packages/global-packages/packages/editor/js/hooks/constants';

describe('isSiteEditorPostType', () => {
	it('is true only for site-editor entity types', () => {
		expect(isSiteEditorPostType('wp_template')).toBe(true);
		expect(isSiteEditorPostType('wp_template_part')).toBe(true);
		expect(isSiteEditorPostType('wp_navigation')).toBe(true);
		expect(isSiteEditorPostType('wp_block')).toBe(true);
		expect(isSiteEditorPostType('page')).toBe(false);
		expect(isSiteEditorPostType(null)).toBe(false);
		expect(isSiteEditorPostType('')).toBe(false);
	});
});

describe('isTemplateAutosavePreviewType', () => {
	it('is true for templates and template parts only', () => {
		expect(isTemplateAutosavePreviewType('wp_template')).toBe(true);
		expect(isTemplateAutosavePreviewType('wp_template_part')).toBe(true);
		expect(isTemplateAutosavePreviewType('wp_navigation')).toBe(false);
		expect(isTemplateAutosavePreviewType(null)).toBe(false);
	});
});

describe('isValidUrl', () => {
	it('accepts http(s) URLs and rejects everything else', () => {
		expect(isValidUrl('https://example.com/path')).toBe(true);
		expect(isValidUrl('http://localhost:8888')).toBe(true);
		expect(isValidUrl('javascript:alert(1)')).toBe(false);
		expect(isValidUrl('not a url')).toBe(false);
		expect(isValidUrl('')).toBe(false);
		expect(isValidUrl(null)).toBe(false);
	});
});

describe('appendQueryParams', () => {
	it('returns empty input unchanged', () => {
		expect(appendQueryParams('', { a: '1' })).toBe('');
		expect(appendQueryParams(null, { a: '1' })).toBe('');
	});

	it('sets and overwrites query params on a valid URL', () => {
		expect(
			appendQueryParams('https://example.com/page?a=old', {
				a: 'new',
				b: '2',
			})
		).toBe('https://example.com/page?a=new&b=2');
	});

	it('returns the original string when the URL cannot be parsed', () => {
		expect(appendQueryParams('/relative-path', { a: '1' })).toBe(
			'/relative-path'
		);
	});
});

describe('parseTemplateSlug', () => {
	it('returns null for empty slugs', () => {
		expect(parseTemplateSlug(null)).toBeNull();
		expect(parseTemplateSlug('')).toBeNull();
	});

	it('maps home, search, and simple hierarchy slugs', () => {
		expect(parseTemplateSlug('index')).toMatchObject({ type: 'home' });
		expect(parseTemplateSlug('front-page')).toMatchObject({ type: 'home' });
		expect(parseTemplateSlug('search')).toMatchObject({ type: 'search' });
		expect(parseTemplateSlug('404')).toMatchObject({ type: '404' });
		expect(parseTemplateSlug('singular')).toMatchObject({ type: 'single' });
	});

	it('parses prefixed archive, single, page, taxonomy, and author slugs', () => {
		expect(parseTemplateSlug('archive-product')).toEqual({
			type: 'archive',
			postType: 'product',
			originalSlug: 'archive-product',
		});
		expect(parseTemplateSlug('single-post-hello-world')).toEqual({
			type: 'single',
			postType: 'post',
			entitySlug: 'hello-world',
			originalSlug: 'single-post-hello-world',
		});
		expect(parseTemplateSlug('page-about')).toEqual({
			type: 'page',
			entitySlug: 'about',
			originalSlug: 'page-about',
		});
		expect(parseTemplateSlug('category-news')).toEqual({
			type: 'category',
			taxonomy: 'category',
			entitySlug: 'news',
			originalSlug: 'category-news',
		});
		expect(parseTemplateSlug('taxonomy-genre-jazz')).toEqual({
			type: 'taxonomy',
			taxonomy: 'genre',
			entitySlug: 'jazz',
			originalSlug: 'taxonomy-genre-jazz',
		});
		expect(parseTemplateSlug('author-jane')).toEqual({
			type: 'author',
			entitySlug: 'jane',
			originalSlug: 'author-jane',
		});
	});

	it('marks unknown slugs instead of throwing', () => {
		expect(parseTemplateSlug('custom-thing')).toEqual({
			type: 'unknown',
			originalSlug: 'custom-thing',
		});
	});
});

describe('buildTemplatePartPreviewUrl', () => {
	it('returns null when the theme//slug id is malformed', () => {
		expect(
			buildTemplatePartPreviewUrl('header', 'https://example.com')
		).toBeNull();
		expect(
			buildTemplatePartPreviewUrl('//header', 'https://example.com')
		).toBeNull();
		expect(
			buildTemplatePartPreviewUrl('theme//', 'https://example.com')
		).toBeNull();
	});

	it('appends the isolated preview query args', () => {
		const url = buildTemplatePartPreviewUrl(
			'twentytwentyfive//header',
			'https://example.com/'
		);

		expect(url).toContain('blockera-template-part-preview=1');
		expect(url).toContain('theme=twentytwentyfive');
		expect(url).toContain('slug=header');
	});
});

describe('getAdminBaseUrl and getEditorUrl', () => {
	it('extracts /wp-admin from the current pathname', () => {
		window.history.replaceState(
			{},
			'',
			'/wp-admin/site-editor.php?p=/'
		);

		expect(getAdminBaseUrl()).toMatch(/\/wp-admin$/);
	});

	it('routes site-editor types to site-editor.php and posts to post.php', () => {
		window.history.replaceState({}, '', '/wp-admin/post.php?post=1');

		const templateUrl = getEditorUrl('wp_template', 'theme//home');
		const postUrl = getEditorUrl('page', 12);

		expect(templateUrl).toContain('site-editor.php');
		expect(templateUrl).toContain('postType=wp_template');
		expect(templateUrl).toContain('canvas=edit');
		expect(postUrl).toContain('post.php');
		expect(postUrl).toContain('post=12');
		expect(postUrl).toContain('action=edit');
	});
});
