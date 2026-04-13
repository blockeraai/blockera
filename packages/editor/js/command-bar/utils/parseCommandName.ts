/**
 * Result of parsing a command name.
 */
export interface ParsedCommandName {
	/** The post type (e.g., 'post', 'page'). */
	type: string;
	/** The post ID (number for regular posts, string for templates). */
	id: number | string;
}

/**
 * Known post types used in navigation commands.
 */
const POST_TYPES = ['post', 'page', 'wp_template', 'wp_template_part'] as const;

/**
 * Parse Gutenberg command name to extract post type and post ID
 * Gutenberg uses format: "postType-postId" (e.g., "page-123", "wp_template-theme//name")
 *
 * @param commandName - Command name from Gutenberg
 * @return Object with type and id, or null if parsing fails
 */
export function parseCommandName(
	commandName: string | null | undefined
): ParsedCommandName | null {
	if (!commandName || typeof commandName !== 'string') {
		return null;
	}

	for (const postType of POST_TYPES) {
		const prefix = postType + '-';
		if (commandName.startsWith(prefix)) {
			const id = commandName.slice(prefix.length);
			if (id) {
				return {
					type: postType,
					id: /^\d+$/.test(id) ? parseInt(id, 10) : id,
				};
			}
		}
	}

	return null;
}
