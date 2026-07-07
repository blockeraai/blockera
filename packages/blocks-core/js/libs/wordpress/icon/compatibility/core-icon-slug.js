// @flow

/** WordPress SVG icon registry namespace (core/icon block attribute format). */
export const CORE_ICON_NAMESPACE = 'core/';

/**
 * Strip the WordPress core icon namespace for Blockera wp library slugs.
 *
 * @param {string} slug Icon slug from core/icon or blockeraIcon.
 * @return {string} Slug without the `core/` prefix.
 */
export function stripCoreIconNamespace(slug: string): string {
	if (!slug || typeof slug !== 'string') {
		return '';
	}

	return slug.startsWith(CORE_ICON_NAMESPACE)
		? slug.slice(CORE_ICON_NAMESPACE.length)
		: slug;
}

/**
 * Normalize a Blockera wp library slug to core/icon attribute format.
 *
 * @param {string} slug Blockera wp icon slug (with or without `core/`).
 * @return {string} Namespaced slug for the WP icon attribute / REST entity id.
 */
export function toCoreIconAttribute(slug: string): string {
	if (!slug || typeof slug !== 'string') {
		return '';
	}

	if (slug.startsWith(CORE_ICON_NAMESPACE)) {
		return slug;
	}

	return CORE_ICON_NAMESPACE + slug;
}
