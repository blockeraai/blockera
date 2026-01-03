/**
 * Type declarations for CSS raw imports
 * Allows importing CSS files as raw text strings using ?raw suffix
 */

declare module '*.css?raw' {
	const content: string;
	export default content;
}
