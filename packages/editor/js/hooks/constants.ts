/**
 * Shared constants for document URL handling.
 *
 * @package
 */

/**
 * Post types that are edited in the Site Editor (not the Post Editor).
 * These types use site-editor.php instead of post.php for editing.
 */
export const SITE_EDITOR_POST_TYPES: readonly string[] = [
	'wp_template',
	'wp_template_part',
	'wp_navigation',
	'wp_block',
] as const;

/**
 * Type for Site Editor post types.
 */
export type SiteEditorPostType = (typeof SITE_EDITOR_POST_TYPES)[number];

/**
 * Query argument used to hide the admin bar in preview/view URLs.
 * Must match the PHP constant in Blockera_Preview_Button::HIDE_ADMIN_BAR_ARG.
 */
export const HIDE_ADMIN_BAR_ARG = 'blockera-hide-admin-bar' as const;

/**
 * Template types that use the home/front page URL for preview.
 * These templates represent the site's main entry points.
 */
export const HOME_URL_TEMPLATES = ['index', 'home', 'front-page'] as const;

/**
 * Template types that don't have a previewable frontend URL.
 * These are structural post types that appear on multiple pages.
 */
export const NON_PREVIEWABLE_POST_TYPES = [
	'wp_template_part',
	'wp_navigation',
	'wp_block',
] as const;

/**
 * Post type for WordPress templates.
 */
export const TEMPLATE_POST_TYPE = 'wp_template' as const;

/**
 * Parsed template slug information.
 * Contains the template type category and any entity/term identifiers.
 */
export interface ParsedTemplateSlug {
	/** The broad category of template (e.g., 'home', 'single', 'archive', 'taxonomy'). */
	type: TemplateSlugType;
	/** For single-{post_type} templates, the post type slug. */
	postType?: string;
	/** For taxonomy-{taxonomy}-{term} templates, the taxonomy slug. */
	taxonomy?: string;
	/** For specific entity templates (page-{slug}, category-{slug}), the entity slug. */
	entitySlug?: string;
	/** The original template slug. */
	originalSlug: string;
}

/**
 * Template slug type categories for URL generation.
 */
export type TemplateSlugType =
	| 'home' // index, home, front-page
	| 'search' // search
	| '404' // 404
	| 'single' // single, singular, single-{post_type}
	| 'page' // page, page-{slug}
	| 'archive' // archive, archive-{post_type}
	| 'category' // category, category-{slug}
	| 'tag' // tag, tag-{slug}
	| 'author' // author, author-{slug}
	| 'taxonomy' // taxonomy, taxonomy-{taxonomy}, taxonomy-{taxonomy}-{term}
	| 'date' // date
	| 'attachment' // attachment
	| 'privacy-policy' // privacy-policy
	| 'header' // header template part
	| 'footer' // footer template part
	| 'unknown'; // fallback for unrecognized templates
