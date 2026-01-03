/**
 * Result of parsing a WordPress admin URL.
 */
export interface ParsedUrl {
	/** The post type (e.g., 'post', 'page', 'wp_template') */
	type: string;
	/** The post ID (number for regular posts, string for templates) */
	id: number | string;
}

/**
 * Parse WordPress admin URL to extract post type and post ID
 *
 * @param url - WordPress admin URL
 * @returns Object with type and id, or null if parsing fails
 */
export function parseUrl(url: string | null | undefined): ParsedUrl | null {
	if (!url || typeof url !== 'string') {
		return null;
	}

	try {
		const urlObj = new URL(url, window.location.origin);
		const params = new URLSearchParams(urlObj.search);
		const pathname = urlObj.pathname;

		// Handle post.php URLs: post.php?post=123&action=edit
		if (pathname.includes('post.php')) {
			const postId = params.get('post');
			const postType = params.get('post_type') ?? 'post';

			if (postId) {
				return {
					type: postType,
					id: parseInt(postId, 10),
				};
			}
		}

		// Handle site-editor.php URLs
		if (pathname.includes('site-editor.php')) {
			// Format: site-editor.php?postType=wp_template&postId=theme-slug
			const postType = params.get('postType');
			const postId = params.get('postId');

			if (postType && postId) {
				return {
					type: postType,
					id: postId,
				};
			}

			// Format: site-editor.php?p=/page/123 or site-editor.php?p=/wp_template/theme//name
			// This is the format Gutenberg uses for navigation commands
			const p = params.get('p');
			if (p) {
				const pathParts = p.split('/').filter(Boolean);
				if (pathParts.length >= 2) {
					// First part is postType, rest is the ID (may contain slashes for templates)
					const type = pathParts[0];
					const idPart = pathParts.slice(1).join('/');
					return {
						type: type ?? '',
						id: /^\d+$/.test(idPart) ? parseInt(idPart, 10) : idPart,
					};
				}
			}

			// Format: site-editor.php?path=/wp_template_part/header
			const path = params.get('path');
			if (path) {
				const pathParts = path.split('/').filter(Boolean);
				if (pathParts.length >= 2) {
					return {
						type: pathParts[0] ?? '',
						id: pathParts.slice(1).join('/'),
					};
				}
			}
		}

		return null;
	} catch {
		// Invalid URL format
		return null;
	}
}

/**
 * Parse site editor path to extract post type and post ID
 * Handles paths like "/page/123" or "/wp_template/theme//template-name"
 *
 * @param path - Site editor path (e.g., "/page/123?canvas=edit")
 * @returns Object with type and id, or null if parsing fails
 */
export function parseSiteEditorPath(
	path: string | null | undefined
): ParsedUrl | null {
	if (!path || typeof path !== 'string') {
		return null;
	}

	try {
		// Remove query string if present
		const pathWithoutQuery = path.split('?')[0] ?? '';
		const pathParts = pathWithoutQuery.split('/').filter(Boolean);

		if (pathParts.length >= 2) {
			const type = pathParts[0];
			const idPart = pathParts.slice(1).join('/');

			return {
				type: type ?? '',
				id: /^\d+$/.test(idPart) ? parseInt(idPart, 10) : idPart,
			};
		}

		return null;
	} catch {
		return null;
	}
}

