/**
 * Hook for managing iframe height calculation and updates.
 * Handles postMessage from iframe, ResizeObserver fallback, and prevents feedback loops.
 */

import { useEffect, useLayoutEffect, useRef, useCallback, useState } from '@wordpress/element';
import {
	HEIGHT_UPDATE_DEBOUNCE,
	HEIGHT_CHANGE_THRESHOLD,
	MAX_REASONABLE_HEIGHT,
} from '../utils/constants';
import { getEditorCanvasIframe, getIframeDocument } from '../utils/iframeUtils';
import type { UseIframeHeightReturn } from '../types';

/**
 * Options for useIframeHeight hook.
 */
interface UseIframeHeightOptions {
	/** Current zoom percentage */
	zoomPercent: number;
	/** Callback when height should be applied to iframe */
	onHeightChange?: (height: number) => void;
	/** Whether height updates are enabled */
	enabled?: boolean;
	/** Initial height to use as minimum (prevents shrinking below this value) */
	initialHeight?: number | null;
	/** Callback to set the initial height */
	onSetInitialHeight?: (height: number) => void;
}

/**
 * Hook to manage iframe height calculation.
 * Listens for postMessage from iframe, uses ResizeObserver as fallback,
 * and debounces updates to prevent feedback loops.
 *
 * @param options - Hook options.
 * @returns Height management utilities.
 */
export function useIframeHeight({
	zoomPercent,
	onHeightChange,
	enabled = true,
	initialHeight,
	onSetInitialHeight,
}: UseIframeHeightOptions): UseIframeHeightReturn {
	const [contentHeight, setContentHeight] = useState<number | null>(null);

	// Track update state to prevent feedback loops
	const isUpdatingRef = useRef(false);
	const lastHeightRef = useRef<number | null>(null);
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const pauseUpdatesRef = useRef(false);
	const initialHeightRef = useRef<number | null>(null);

	// Update initial height ref synchronously when prop changes
	// Use useLayoutEffect to update before paint, ensuring postMessage handlers see updated value immediately
	// This prevents race conditions where postMessage arrives before ref is updated
	useLayoutEffect(() => {
		const normalizedValue = initialHeight !== null && initialHeight !== undefined ? initialHeight : null;
		initialHeightRef.current = normalizedValue;
	}, [initialHeight]);

	/**
	 * Update iframe height with debouncing and feedback loop prevention.
	 * Only updates if height change is significant and not currently updating.
	 * If initial height is set, uses the larger of newHeight or initialHeight.
	 */
	const updateHeight = useCallback(
		(newHeight: number) => {
			// Ignore if updates are paused (prevents feedback loops)
			if (pauseUpdatesRef.current) {
				return;
			}

			// Ignore unreasonably large heights (feedback loop protection)
			if (newHeight > MAX_REASONABLE_HEIGHT) {
				return;
			}

			// Ignore if already updating (prevents recursive calls)
			if (isUpdatingRef.current) {
				return;
			}

			// If we have an initial height, use the larger of newHeight or initialHeight
			// This prevents the iframe from shrinking below the initial height
			const effectiveHeight =
				initialHeightRef.current !== null &&
				initialHeightRef.current > newHeight
					? initialHeightRef.current
					: newHeight;

			// Check if height change is significant
			const lastHeight = lastHeightRef.current;
			if (
				lastHeight !== null &&
				Math.abs(effectiveHeight - lastHeight) < HEIGHT_CHANGE_THRESHOLD
			) {
				// Height hasn't changed significantly, skip update
				return;
			}

			// Clear any pending debounced update
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}

			// Debounce the update to prevent rapid-fire changes
			debounceTimeoutRef.current = setTimeout(() => {
				// Double-check conditions after debounce delay
				if (pauseUpdatesRef.current || isUpdatingRef.current) {
					return;
				}

				// Mark as updating to prevent recursive calls
				isUpdatingRef.current = true;

				// Update state with effective height
				setContentHeight(effectiveHeight);
				lastHeightRef.current = effectiveHeight;

				// Call callback to apply height to iframe
				onHeightChange?.(effectiveHeight);

				// Reset updating flag after a short delay
				// This allows the DOM to update before allowing another update
				requestAnimationFrame(() => {
					setTimeout(() => {
						isUpdatingRef.current = false;
					}, 50);
				});
			}, HEIGHT_UPDATE_DEBOUNCE);
		},
		[onHeightChange]
	);

	/**
	 * Handle postMessage from iframe with height information.
	 */
	useEffect(() => {
		if (!enabled) {
			return;
		}

		const handleMessage = (event: MessageEvent): void => {
			// Security: In production, you might want to check event.origin
			// For now, allowing all origins since it's same-origin within wp-admin
			const data = event.data;
			if (!data || data.type !== 'IFRAME_HEIGHT') {
				return;
			}

			const height = Number(data.height) || 0;
			if (height > 0) {
				updateHeight(height);
			}
		};

		window.addEventListener('message', handleMessage);

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, [enabled, updateHeight]);

	/**
	 * Fallback: Use ResizeObserver on iframe document body.
	 * This is used when postMessage is not available or not working.
	 */
	useEffect(() => {
		if (!enabled) {
			return;
		}

		const iframe = getEditorCanvasIframe();
		const iframeDoc = getIframeDocument(iframe);

		if (!iframeDoc || !iframeDoc.body) {
			return;
		}

		let resizeObserver: ResizeObserver | null = null;

		// Only use ResizeObserver as fallback if we haven't received postMessage recently
		// Check after a delay to see if postMessage is working
		const fallbackTimeout = setTimeout(() => {
			// If we still don't have height from postMessage, use ResizeObserver
			if (contentHeight === null && iframeDoc.body) {
				resizeObserver = new ResizeObserver(() => {
					const height = Math.max(
						iframeDoc.body.scrollHeight || 0,
						iframeDoc.body.offsetHeight || 0
					);

					if (height > 0) {
						updateHeight(height);
					}
				});

				resizeObserver.observe(iframeDoc.body);

				// Also observe editor wrapper if available
				const editorWrapper = iframeDoc.querySelector(
					'.editor-styles-wrapper'
				);
				if (editorWrapper) {
					resizeObserver.observe(editorWrapper);
				}
			}
		}, 500); // Wait 500ms for postMessage before using fallback

		return () => {
			clearTimeout(fallbackTimeout);
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
		};
	}, [enabled, contentHeight, updateHeight]);

	/**
	 * Manually trigger height recalculation.
	 */
	const recalculateHeight = useCallback(() => {
		const iframe = getEditorCanvasIframe();
		const iframeDoc = getIframeDocument(iframe);

		if (!iframeDoc || !iframeDoc.body) {
			return;
		}

		// Calculate height directly from iframe document
		const height = Math.max(
			iframeDoc.body.scrollHeight || 0,
			iframeDoc.body.offsetHeight || 0
		);

		// Also check editor wrapper
		const editorWrapper = iframeDoc.querySelector('.editor-styles-wrapper') as HTMLElement | null;
		if (editorWrapper) {
			const wrapperHeight = Math.max(
				editorWrapper.scrollHeight || 0,
				editorWrapper.offsetHeight || 0
			);
			if (wrapperHeight > height) {
				updateHeight(wrapperHeight);
				return;
			}
		}

		if (height > 0) {
			updateHeight(height);
		}
	}, [updateHeight]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, []);

	return {
		contentHeight,
		recalculateHeight,
	};
}
