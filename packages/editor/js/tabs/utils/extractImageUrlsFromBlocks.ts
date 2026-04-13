/**
 * Extract image URLs from raw content using regex
 *
 * Finds all image URLs in the raw content string using two methods:
 * 1. Extracts src attributes from <img> tags (catches all img tag URLs)
 * 2. Matches URLs ending with image file extensions (catches URLs in any context)
 *
 * Works regardless of context (HTML attributes, CSS properties, JSON, etc.).
 * Uses regex for fast, simple extraction.
 *
 * @param rawContent - Raw content string to search for image URLs
 * @return Array of unique image URLs found in content
 */
export function extractImageUrlsFromBlocks(
	rawContent: string | null | undefined
): string[] {
	if (
		!rawContent ||
		typeof rawContent !== 'string' ||
		rawContent.trim() === ''
	) {
		return [];
	}

	const imageUrls = new Set<string>();

	// Method 1: Extract src attributes from <img> tags
	// Matches <img> tags with src attribute in various formats:
	// - <img src="url">
	// - <img src='url'>
	// - <img src=url>
	// - <img ... src="url" ...>
	const imgTagPattern = /<img[^>]+src\s*=\s*["']?([^"'\s>]+)["']?/gi;
	let imgTagMatch: RegExpExecArray | null;

	while ((imgTagMatch = imgTagPattern.exec(rawContent)) !== null) {
		const url = imgTagMatch[1];
		if (url?.trim()) {
			const cleanUrl = url.trim();
			// Validate URL format
			if (
				cleanUrl.startsWith('//') ||
				cleanUrl.startsWith('http://') ||
				cleanUrl.startsWith('https://') ||
				cleanUrl.startsWith('/') ||
				cleanUrl.startsWith('data:')
			) {
				imageUrls.add(cleanUrl);
			}
		}
	}

	// Method 2: Regex pattern to match image file URLs by extension
	// Matches URLs ending with image file extensions (case-insensitive)
	// Handles:
	// - Absolute URLs: http://, https://
	// - Protocol-relative URLs: //
	// - Relative URLs: /path/to/image.jpg
	// - URLs with query strings: image.jpg?v=123
	// - URLs in quotes: "url", 'url'
	// - URLs in parentheses: url(...)
	// - URLs in various contexts (HTML attributes, CSS, JSON, etc.)
	const imageUrlPattern =
		/(?:https?:\/\/|\/\/|\/)[^\s<>"']+\.(?:jpg|jpeg|png|gif|webp|svg|bmp|ico)(?:\?[^\s<>"']*)?(?:#[^\s<>"']*)?/gi;

	// Find all matches
	const matches = rawContent.match(imageUrlPattern);

	if (matches && matches.length > 0) {
		matches.forEach((match) => {
			// Clean up the URL - remove quotes, parentheses, and whitespace
			let url = match.trim();

			// Remove leading/trailing quotes
			url = url.replace(/^["']|["']$/g, '');

			// Remove url() wrapper from CSS
			url = url.replace(/^url\(|\)$/g, '');

			// Remove leading/trailing quotes again (in case url() had quotes)
			url = url.replace(/^["']|["']$/g, '');

			// Trim whitespace
			url = url.trim();

			// Validate URL format
			if (url && url.length > 0) {
				// Check if it's a valid URL format
				if (
					url.startsWith('//') ||
					url.startsWith('http://') ||
					url.startsWith('https://') ||
					url.startsWith('/')
				) {
					imageUrls.add(url);
				}
			}
		});
	}

	// Convert Set to Array
	return Array.from(imageUrls);
}
