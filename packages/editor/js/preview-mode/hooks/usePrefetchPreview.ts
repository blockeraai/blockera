/**
 * Hook to prefetch the preview URL when hovering over the preview button.
 *
 * Uses browser-level <link rel="prefetch"> to hint the browser to fetch the
 * preview page when idle. This warms the cache so the iframe loads faster
 * when the user actually clicks the preview button.
 *
 * Prefetch conditions:
 * - Only prefetch once per "save cycle" (resets when page is saved)
 * - Don't prefetch when page is dirty (unsaved changes)
 * - Only prefetch if we have a valid view URL
 *
 * @package
 */

/**
 * WordPress dependencies
 */
import { useCallback, useRef, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { HIDE_ADMIN_BAR_ARG } from '../../hooks/constants';

/**
 * Props for the usePrefetchPreview hook.
 */
interface UsePrefetchPreviewProps {
	/** The base view URL to prefetch (without admin bar param). */
	viewUrl: string | null;
	/** Whether the page has unsaved changes. */
	dirty: boolean;
	/** Whether the view URL is valid. */
	hasValidViewUrl: boolean;
}

/**
 * Return type for usePrefetchPreview hook.
 */
interface UsePrefetchPreviewReturn {
	/** Function to call on mouse enter to trigger prefetch. */
	handleMouseEnter: () => void;
}

/**
 * Build the prefetch URL with the hide admin bar parameter.
 *
 * @param baseUrl - The base view URL.
 * @return The URL with HIDE_ADMIN_BAR_ARG appended.
 */
const buildPrefetchUrl = (baseUrl: string): string => {
	try {
		const urlObj = new URL(baseUrl);
		urlObj.searchParams.set(HIDE_ADMIN_BAR_ARG, '1');
		return urlObj.toString();
	} catch {
		// If URL parsing fails, return as-is
		return baseUrl;
	}
};

/**
 * Create and inject a prefetch link element into the document head.
 *
 * @param url - The URL to prefetch.
 * @return The created link element (for cleanup if needed).
 */
const injectPrefetchLink = (url: string): HTMLLinkElement => {
	const link = document.createElement('link');
	link.rel = 'prefetch';
	link.href = url;
	// Set as document type for full page prefetch
	link.as = 'document';
	document.head.appendChild(link);
	return link;
};

/**
 * Remove a prefetch link element from the document head.
 *
 * @param link - The link element to remove.
 */
const removePrefetchLink = (link: HTMLLinkElement): void => {
	if (link.parentNode) {
		link.parentNode.removeChild(link);
	}
};

/**
 * Hook to prefetch the preview URL on hover.
 *
 * @param props - Hook props containing viewUrl, dirty state, and validation.
 * @return Object with handleMouseEnter function.
 */
export function usePrefetchPreview({
	viewUrl,
	dirty,
	hasValidViewUrl,
}: UsePrefetchPreviewProps): UsePrefetchPreviewReturn {
	// Track whether we've already prefetched in this save cycle
	const hasPrefetchedRef = useRef(false);

	// Track the current prefetch link element for cleanup
	const prefetchLinkRef = useRef<HTMLLinkElement | null>(null);

	// Track previous dirty state to detect save completion (dirty: true → false)
	const prevDirtyRef = useRef(dirty);

	/**
	 * Reset prefetch state when page is saved (dirty transitions from true to false).
	 * This allows a new prefetch after the user saves their changes.
	 */
	useEffect(() => {
		// Detect save completion: dirty was true, now it's false
		if (prevDirtyRef.current && !dirty) {
			// Page was saved, reset prefetch state
			hasPrefetchedRef.current = false;

			// Remove old prefetch link since content has changed
			if (prefetchLinkRef.current) {
				removePrefetchLink(prefetchLinkRef.current);
				prefetchLinkRef.current = null;
			}
		}

		// Update previous dirty state
		prevDirtyRef.current = dirty;
	}, [dirty]);

	/**
	 * Cleanup prefetch link on unmount.
	 */
	useEffect(() => {
		return () => {
			if (prefetchLinkRef.current) {
				removePrefetchLink(prefetchLinkRef.current);
				prefetchLinkRef.current = null;
			}
		};
	}, []);

	/**
	 * Handle mouse enter on the preview button.
	 * Triggers prefetch if conditions are met.
	 */
	const handleMouseEnter = useCallback((): void => {
		// Don't prefetch if:
		// - Already prefetched in this save cycle
		// - Page has unsaved changes (dirty)
		// - No valid view URL
		if (hasPrefetchedRef.current || dirty || !hasValidViewUrl || !viewUrl) {
			return;
		}

		// Build the prefetch URL with hide admin bar parameter
		const prefetchUrl = buildPrefetchUrl(viewUrl);

		// Inject prefetch link into document head
		prefetchLinkRef.current = injectPrefetchLink(prefetchUrl);

		// Mark as prefetched for this save cycle
		hasPrefetchedRef.current = true;
	}, [dirty, hasValidViewUrl, viewUrl]);

	return {
		handleMouseEnter,
	};
}
