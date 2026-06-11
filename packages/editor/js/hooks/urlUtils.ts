/**
 * Pure utility functions for document URL handling.
 * These are not React hooks - they are synchronous, stateless functions.
 *
 * @package
 */

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import {
	SITE_EDITOR_POST_TYPES,
	HOME_URL_TEMPLATES,
	TEMPLATE_AUTOSAVE_PREVIEW_REST_BASE,
	TEMPLATE_PART_PREVIEW_ARG,
	type ParsedTemplateSlug,
} from './constants';

/**
 * Check if a post type is a Site Editor type.
 * Site Editor types are edited in site-editor.php instead of post.php.
 *
 * @param postType - The post type to check.
 * @return True if the post type is a Site Editor type.
 */
export function isSiteEditorPostType(
	postType: string | null | undefined
): boolean {
	if (!postType) {
		return false;
	}
	return SITE_EDITOR_POST_TYPES.includes(postType);
}

/**
 * Get the WordPress admin base URL.
 * Extracts the admin path from the current browser location.
 *
 * @return Admin base URL (e.g., https://example.com/wp-admin)
 */
export function getAdminBaseUrl(): string {
	const currentUrl = window.location;

	// Extract admin path from current URL
	// WordPress admin URLs are typically /wp-admin/...
	const pathMatch = currentUrl.pathname.match(/^(.+\/wp-admin)/);
	if (pathMatch?.[1]) {
		return currentUrl.origin + pathMatch[1];
	}

	// Fallback: assume standard /wp-admin/ path
	return currentUrl.origin + '/wp-admin';
}

/**
 * Get the editor URL for a post/entity.
 * Returns the WordPress admin URL for editing the specified document.
 *
 * @param postType - Post type (e.g., 'post', 'page', 'wp_template').
 * @param postId - Post ID.
 * @return Full editor URL.
 */
export function getEditorUrl(
	postType: string,
	postId: string | number
): string {
	const adminBaseUrl = getAdminBaseUrl();

	// Site editor entities use site-editor.php
	if (isSiteEditorPostType(postType)) {
		const relativeUrl = addQueryArgs('site-editor.php', {
			postType,
			postId: String(postId),
			canvas: 'edit',
		});
		const separator = adminBaseUrl.endsWith('/') ? '' : '/';
		return adminBaseUrl + separator + relativeUrl;
	}

	// Standard posts/pages use post.php
	const relativeUrl = addQueryArgs('post.php', {
		post: String(postId),
		action: 'edit',
		post_type: postType,
	});
	const separator = adminBaseUrl.endsWith('/') ? '' : '/';
	return adminBaseUrl + separator + relativeUrl;
}

/**
 * Check if a URL is valid (http or https protocol).
 *
 * @param url - The URL to validate.
 * @return True if the URL is valid, false otherwise.
 */
export function isValidUrl(url: string | null | undefined): boolean {
	if (!url || typeof url !== 'string') {
		return false;
	}
	try {
		const urlObj = new URL(url);
		return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
	} catch {
		return false;
	}
}

/**
 * Append query parameters to a URL.
 * Safely handles invalid URLs by returning the original URL.
 *
 * @param url - The base URL.
 * @param params - Object of key-value pairs to append as query parameters.
 * @return The URL with appended query parameters.
 */
export function appendQueryParams(
	url: string | null | undefined,
	params: Record<string, string>
): string {
	if (!url) {
		return url ?? '';
	}
	try {
		const urlObj = new URL(url);
		Object.entries(params).forEach(([key, value]) => {
			urlObj.searchParams.set(key, value);
		});
		return urlObj.toString();
	} catch {
		return url;
	}
}

/**
 * Parse a template slug to extract type and entity information.
 *
 * Template slugs follow WordPress template hierarchy patterns:
 * - Simple: index, home, front-page, search, 404, archive, single, page
 * - Post type specific: single-{post_type}, archive-{post_type}, page-{slug}
 * - Taxonomy: category, tag, taxonomy-{taxonomy}, category-{slug}, tag-{slug}
 * - Author: author, author-{slug}
 *
 * @param templateSlug - The template slug to parse (e.g., 'single-post', 'category-news').
 * @return Parsed template information with type and entity identifiers.
 */
export function parseTemplateSlug(
	templateSlug: string | null | undefined
): ParsedTemplateSlug | null {
	if (!templateSlug) {
		return null;
	}

	const slug = templateSlug.toLowerCase().trim();

	// Check for home/front-page templates first (most common)
	if (
		HOME_URL_TEMPLATES.includes(slug as (typeof HOME_URL_TEMPLATES)[number])
	) {
		return {
			type: 'home',
			originalSlug: templateSlug,
		};
	}

	// Simple template types without prefixes
	if (slug === 'search') {
		return { type: 'search', originalSlug: templateSlug };
	}

	if (slug === '404') {
		return { type: '404', originalSlug: templateSlug };
	}

	if (slug === 'privacy-policy') {
		return { type: 'privacy-policy', originalSlug: templateSlug };
	}

	if (slug === 'date') {
		return { type: 'date', originalSlug: templateSlug };
	}

	if (slug === 'attachment') {
		return { type: 'attachment', originalSlug: templateSlug };
	}

	// singular template (fallback for all single entries)
	if (slug === 'singular') {
		return { type: 'single', originalSlug: templateSlug };
	}

	// Archive templates: archive, archive-{post_type}
	if (slug === 'archive') {
		return { type: 'archive', originalSlug: templateSlug };
	}

	if (slug.startsWith('archive-')) {
		const postType = slug.slice('archive-'.length);
		return {
			type: 'archive',
			postType,
			originalSlug: templateSlug,
		};
	}

	// Single templates: single, single-{post_type}, single-{post_type}-{slug}
	if (slug === 'single') {
		return { type: 'single', originalSlug: templateSlug };
	}

	if (slug.startsWith('single-')) {
		const rest = slug.slice('single-'.length);
		// Check if it's single-{post_type}-{slug} pattern
		const dashIndex = rest.indexOf('-');
		if (dashIndex > 0) {
			// Could be single-post-my-slug or single-custom_type
			// We'll treat the first segment as post type
			const postType = rest.slice(0, dashIndex);
			const entitySlug = rest.slice(dashIndex + 1);
			return {
				type: 'single',
				postType,
				entitySlug,
				originalSlug: templateSlug,
			};
		}
		return {
			type: 'single',
			postType: rest,
			originalSlug: templateSlug,
		};
	}

	// Page templates: page, page-{slug}
	if (slug === 'page') {
		return { type: 'page', originalSlug: templateSlug };
	}

	if (slug.startsWith('page-')) {
		const entitySlug = slug.slice('page-'.length);
		return {
			type: 'page',
			entitySlug,
			originalSlug: templateSlug,
		};
	}

	// Category templates: category, category-{slug}
	if (slug === 'category') {
		return { type: 'category', originalSlug: templateSlug };
	}

	if (slug.startsWith('category-')) {
		const entitySlug = slug.slice('category-'.length);
		return {
			type: 'category',
			taxonomy: 'category',
			entitySlug,
			originalSlug: templateSlug,
		};
	}

	// Tag templates: tag, tag-{slug}
	if (slug === 'tag') {
		return { type: 'tag', originalSlug: templateSlug };
	}

	if (slug.startsWith('tag-')) {
		const entitySlug = slug.slice('tag-'.length);
		return {
			type: 'tag',
			taxonomy: 'post_tag',
			entitySlug,
			originalSlug: templateSlug,
		};
	}

	// Author templates: author, author-{slug}
	if (slug === 'author') {
		return { type: 'author', originalSlug: templateSlug };
	}

	if (slug.startsWith('author-')) {
		const entitySlug = slug.slice('author-'.length);
		return {
			type: 'author',
			entitySlug,
			originalSlug: templateSlug,
		};
	}

	// Taxonomy templates: taxonomy, taxonomy-{taxonomy}, taxonomy-{taxonomy}-{term}
	if (slug === 'taxonomy') {
		return { type: 'taxonomy', originalSlug: templateSlug };
	}

	if (slug.startsWith('taxonomy-')) {
		const rest = slug.slice('taxonomy-'.length);
		const dashIndex = rest.indexOf('-');
		if (dashIndex > 0) {
			// taxonomy-{taxonomy}-{term}
			const taxonomy = rest.slice(0, dashIndex);
			const entitySlug = rest.slice(dashIndex + 1);
			return {
				type: 'taxonomy',
				taxonomy,
				entitySlug,
				originalSlug: templateSlug,
			};
		}
		// taxonomy-{taxonomy}
		return {
			type: 'taxonomy',
			taxonomy: rest,
			originalSlug: templateSlug,
		};
	}

	// Unknown template type
	return {
		type: 'unknown',
		originalSlug: templateSlug,
	};
}

/**
 * Build the isolated frontend URL for previewing a template part.
 *
 * Template part IDs use the theme//slug format (e.g. twentytwentyfive//header).
 *
 * @param templatePartId Template part id (theme//slug).
 * @param homeUrl        Site home URL.
 * @return Preview URL or null when the id cannot be parsed.
 */
export function buildTemplatePartPreviewUrl(
	templatePartId: string,
	homeUrl: string
): string | null {
	const separatorIndex = templatePartId.indexOf('//');
	if (separatorIndex <= 0) {
		return null;
	}

	const theme = templatePartId.slice(0, separatorIndex);
	const slug = templatePartId.slice(separatorIndex + 2);

	if (!theme || !slug) {
		return null;
	}

	return addQueryArgs(homeUrl, {
		[TEMPLATE_PART_PREVIEW_ARG]: '1',
		theme,
		slug,
	});
}

/**
 * Autosave a site editor template and return preview_link from the REST response.
 *
 * Cold path: runs only when the user opens live preview with unsaved template edits.
 * core-data drops preview_link when the autosave response id matches the template
 * string id (e.g. twentytwentyfive//home), so we read it from the POST body.
 *
 * @param postType Site editor post type (wp_template or wp_template_part).
 * @param postId   Template id (e.g. theme//home).
 * @return Preview URL with preview_nonce, or null on failure.
 */
export async function saveSiteEditorEntityForPreview(
	postType: string,
	postId: string | number
): Promise<string | null> {
	const restBase = TEMPLATE_AUTOSAVE_PREVIEW_REST_BASE[postType];
	if (!restBase) {
		return null;
	}

	const editorSelect = select(editorStore) as {
		getEditedPostContent: () => string;
		getEditedPostAttribute: (attr: string) => unknown;
	};

	// Mirror core-data autosave payload: content + optional title/excerpt only.
	const data: Record<string, string> = {
		content: editorSelect.getEditedPostContent(),
	};
	const title = editorSelect.getEditedPostAttribute('title');
	const excerpt = editorSelect.getEditedPostAttribute('excerpt');
	if (typeof title === 'string') {
		data.title = title;
	}
	if (typeof excerpt === 'string') {
		data.excerpt = excerpt;
	}

	const templateId = String(postId);
	// Match core-data: template ids are theme//slug — must not encode slashes.
	const autosavePath = `/wp/v2/${restBase}/${templateId}/autosaves`;
	const updatePath = `/wp/v2/${restBase}/${templateId}`;

	const coreSelect = select(coreStore) as {
		getEntityRecord: (
			kind: string,
			name: string,
			id: string | number
		) => { source?: string; wp_id?: number } | undefined;
	};
	const entity = coreSelect.getEntityRecord('postType', postType, postId);
	// Theme-file templates have no wp_id; WordPress rejects /autosaves with rest_invalid_template.
	const isThemeFile = !entity?.wp_id || entity?.source === 'theme';

	const requestPreviewLink = async (
		path: string,
		method: 'POST' | 'PUT'
	): Promise<{ preview_link?: string }> =>
		apiFetch<{ preview_link?: string }>({
			path,
			method,
			data,
		});

	try {
		let response: { preview_link?: string };

		if (isThemeFile) {
			response = await requestPreviewLink(updatePath, 'PUT');
		} else {
			try {
				response = await requestPreviewLink(autosavePath, 'POST');
			} catch (autosaveError) {
				const err = autosaveError as { code?: string };
				if (err?.code === 'rest_invalid_template') {
					response = await requestPreviewLink(updatePath, 'PUT');
				} else {
					throw autosaveError;
				}
			}
		}

		return response.preview_link ?? null;
	} catch {
		return null;
	}
}
