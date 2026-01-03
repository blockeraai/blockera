/**
 * Tab icon resolver.
 *
 * Centralizes the logic for choosing the “best” icon for a tab based on its
 * entity type and (for templates) slug. This is intentionally pure and fast
 * since it runs in the tabs UI render path.
 */

/**
 * WordPress dependencies
 */
import {
	archive,
	calendar,
	category,
	home,
	layout,
	notFound,
	navigation,
	page,
	post,
	search,
	symbol,
	tag,
	header,
	footer,
	postAuthor,
	sidebar,
	type IconType,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { isSiteEditorPostType, parseTemplateSlug, TEMPLATE_POST_TYPE } from '../../hooks';

export interface GetTabIconArgs {
	postType: string | null | undefined;
	slug: string | null | undefined;
}

/**
 * Get an icon for a tab.
 *
 * Fallbacks:
 * - Non site-editor entities: `page` (Block Editor “page” icon)
 * - Site editor entities: `layout`
 */
export function getTabIcon({ postType, slug }: GetTabIconArgs): IconType {
	if (!postType) {
		return page;
	}

	// Site Editor entities have their own icon defaults.
	if (isSiteEditorPostType(postType)) {
		const parsed = parseTemplateSlug(slug);

		// Smart template icon selection based on template hierarchy slug.
		if (postType === TEMPLATE_POST_TYPE) {
			switch (parsed?.type) {
				case 'home':
					return home;
				case 'search':
					return search;
				case '404':
					return notFound;
				case 'archive':
					return archive;
				case 'category':
					return category;
				case 'tag':
				case 'taxonomy':
					// Taxonomy is more general, but tag icon is a reasonable indicator.
					return tag;
				case 'date':
					return calendar;
				case 'page':
					return page;
				case 'single':
					// If this is explicitly a page single, prefer page icon; otherwise use post.
					return parsed?.postType === 'page' ? page : post;
				case 'author':
					return postAuthor;
				case 'attachment':
				case 'privacy-policy':
				case 'unknown':
				default:
					return layout;
			}
		}

		// Other site-editor post types.
		switch (postType) {
			case 'wp_template_part':

				// Use prefix matching: originalSlug may start with values like 'header', 'footer', etc.
				if (typeof parsed?.originalSlug === 'string') {
					const slug = parsed.originalSlug;
					if (slug.startsWith('header')) {
						return header;
					} else if (slug.startsWith('footer')) {
						return footer;
					} else if (slug.startsWith('sidebar')) {
						return sidebar;
					}
				}

				return layout;


			case 'wp_block':
				return symbol;
			case 'wp_navigation':
				return navigation;
			default:
				return layout;
		}
	}

	// Common post editor post types.
	switch (postType) {
		case 'post':
			return post;
		case 'page':
			return page;
		default:
			return page;
	}
}


