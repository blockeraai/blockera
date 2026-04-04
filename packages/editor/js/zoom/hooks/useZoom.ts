/**
 * Core hook for managing zoom state and applying zoom transforms.
 */

/**
 * WordPress dependencies
 */
import { useState, useEffect, useCallback, useRef } from '@wordpress/element';
import { subscribe, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	MIN_ZOOM,
	MAX_ZOOM,
	DEFAULT_ZOOM,
	ZOOM_STEP,
	ZOOM_CSS_VAR,
	ZOOMED_OUT_CLASS,
	SCALE_CONTAINER_ZOOMED_CLASS,
	MIN_IFRAME_HEIGHT,
	MAX_REASONABLE_HEIGHT,
} from '../utils/constants';
import { loadZoomFromStorage, saveZoomToStorage } from '../utils/storage';
import {
	getEditorCanvasIframe,
	getIframeDocument,
	getVisualEditorContainer,
	calculateContentHeight,
	injectEditorStylesWrapperOverride,
	syncCanvasHeader,
} from '../utils/iframeUtils';
import type { UseZoomReturn, ZoomPercent } from '../types';

/**
 * Clamp zoom value to valid range.
 *
 * @param zoom - The zoom value to clamp.
 * @return The clamped zoom value.
 */
function clampZoom(zoom: number): ZoomPercent {
	return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom)) as ZoomPercent;
}

/**
 * Hook for managing zoom state and applying zoom transforms to iframe.
 * Handles persistence, CSS transforms, and coordinates with height management.
 *
 * @return Zoom state and control functions.
 */
export function useZoom(): UseZoomReturn {
	// Load initial zoom from storage
	const [zoomPercent, setZoomPercentState] = useState<ZoomPercent>(() =>
		loadZoomFromStorage()
	);

	// Keep ref in sync with state for use in callbacks
	const zoomPercentRef = useRef(zoomPercent);
	const previousZoomRef = useRef<ZoomPercent | null>(null);
	const initialHeightRef = useRef<number | null>(null);

	// Expose initialHeight reactively using state
	// Must be declared before applyZoom so setInitialHeightState is in scope
	const [initialHeightState, setInitialHeightState] = useState<number | null>(
		null
	);

	useEffect(() => {
		zoomPercentRef.current = zoomPercent;
	}, [zoomPercent]);

	/**
	 * Apply zoom transform to iframe.
	 * Sets CSS variables, classes, and iframe attributes based on zoom level.
	 * For smooth transitions, captures and locks iframe height before applying zoom.
	 */
	const applyZoom = useCallback((zoom: ZoomPercent) => {
		const iframe = getEditorCanvasIframe();
		if (!iframe) {
			return;
		}

		const scale = zoom / 100;
		const isZoomed = zoom !== DEFAULT_ZOOM;
		const wasZoomed =
			previousZoomRef.current !== null &&
			previousZoomRef.current !== DEFAULT_ZOOM;
		const isTransitioningTo100 = wasZoomed && !isZoomed;
		const isZoomChanging =
			previousZoomRef.current === null ||
			previousZoomRef.current !== zoom;

		// If not zoomed and not transitioning to 100%, don't apply zoom!!!
		if (!isZoomed && !isTransitioningTo100) {
			return;
		}

		const iframeDoc = getIframeDocument(iframe);

		// Find the scale container element (used by WordPress core)
		const scaleContainer = document.querySelector(
			'.block-editor-iframe__scale-container'
		);

		// Inject CSS override for editor-styles-wrapper::after
		// This fixes the 40vh height issue that causes incorrect height calculations
		// Always apply this override (it's also injected when iframe loads)
		if (iframeDoc) {
			injectEditorStylesWrapperOverride(iframeDoc);

			// Ensure the in-iframe header is synced (breakpoints + zoom combined)
			syncCanvasHeader(zoom);
		}

		// Calculate and set initial height BEFORE every zoom change (in/out)
		// This ensures we always have the current height locked before applying zoom transform
		// The initial height will be used to prevent shrinking if postMessage sends smaller heights
		if (isZoomChanging && !isTransitioningTo100 && iframeDoc) {
			// Get the ACTUAL current iframe height (what's currently rendered)
			// This is more accurate than calculating from content, as it reflects the real rendered size
			const currentIframeHeight =
				iframe.offsetHeight || iframe.clientHeight || 0;
			const currentIframeHeightStyle = iframe.style.height;
			const currentIframeHeightAttr = iframe.getAttribute('height');

			// Also calculate content height as fallback
			const calculatedContentHeight = calculateContentHeight(iframeDoc);

			// Use the larger of: actual iframe height, calculated content height, or style/attr height
			// This ensures we don't shrink the iframe when zooming
			const currentHeight = Math.max(
				currentIframeHeight,
				calculatedContentHeight,
				currentIframeHeightStyle
					? parseInt(
							currentIframeHeightStyle.replace('px', ''),
							10
						) || 0
					: 0,
				currentIframeHeightAttr
					? parseInt(currentIframeHeightAttr.replace('px', ''), 10) ||
							0
					: 0
			);

			if (currentHeight > 0 && currentHeight <= MAX_REASONABLE_HEIGHT) {
				const finalHeight = Math.max(MIN_IFRAME_HEIGHT, currentHeight);

				// Store initial height to prevent shrinking below this value
				// This will be used by useIframeHeight to ignore smaller height updates
				initialHeightRef.current = finalHeight;
				setInitialHeightState(finalHeight); // Update state reactively

				// Temporarily pause iframe updates to prevent feedback loop
				if (iframeDoc.defaultView) {
					iframeDoc.defaultView.postMessage(
						{ type: 'BLOCKERA_ZOOM_PAUSE_UPDATES', pause: true },
						'*'
					);
				}

				// Lock the height BEFORE applying zoom transform
				// This ensures smooth transition without height jumps
				iframe.style.setProperty(
					'height',
					`${finalHeight}px`,
					'important'
				);
				iframe.setAttribute('scrolling', 'no');
				iframe.style.setProperty('overflow', 'hidden', 'important');

				// Wait for height to be applied, then apply zoom transform
				// Use double requestAnimationFrame to ensure height is set in DOM
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						// Now apply zoom classes and transform
						if (isZoomed) {
							iframe.classList.add(ZOOMED_OUT_CLASS);

							if (scaleContainer) {
								scaleContainer.classList.add(
									SCALE_CONTAINER_ZOOMED_CLASS
								);
							}

							// Set CSS variable for zoom scale
							iframe.style.setProperty(
								ZOOM_CSS_VAR,
								scale.toString()
							);
						} else {
							// Removing zoom
							iframe.classList.remove(ZOOMED_OUT_CLASS);

							if (scaleContainer) {
								scaleContainer.classList.remove(
									SCALE_CONTAINER_ZOOMED_CLASS
								);
							}

							// Remove CSS variable
							iframe.style.removeProperty(ZOOM_CSS_VAR);

							// If transitioning back to 100%, remove height constraint
							if (isTransitioningTo100) {
								iframe.style.removeProperty('height');
								iframe.style.removeProperty('overflow');
								iframe.removeAttribute('scrolling');

								// Ensure overflow is set to auto to allow scrolling
								requestAnimationFrame(() => {
									if (
										!iframe.classList.contains(
											ZOOMED_OUT_CLASS
										)
									) {
										iframe.style.setProperty(
											'overflow',
											'auto',
											'important'
										);
									}
								});
							}
						}
					});
				});

				// Resume updates after a delay
				setTimeout(() => {
					if (iframeDoc.defaultView) {
						iframeDoc.defaultView.postMessage(
							{
								type: 'BLOCKERA_ZOOM_PAUSE_UPDATES',
								pause: false,
							},
							'*'
						);
					}
				}, 1000);

				// Update previous zoom ref and return early
				// The zoom transform will be applied in the requestAnimationFrame callback
				previousZoomRef.current = zoom;
				return;
			}
		}

		// Apply zoom classes and styles (for cases where height wasn't locked above)
		if (isZoomed) {
			iframe.classList.add(ZOOMED_OUT_CLASS);

			if (scaleContainer) {
				scaleContainer.classList.add(SCALE_CONTAINER_ZOOMED_CLASS);
			}

			iframe.style.setProperty(ZOOM_CSS_VAR, scale.toString());
		} else {
			iframe.classList.remove(ZOOMED_OUT_CLASS);

			if (scaleContainer) {
				scaleContainer.classList.remove(SCALE_CONTAINER_ZOOMED_CLASS);
			}

			iframe.style.removeProperty(ZOOM_CSS_VAR);

			// If transitioning back to 100%, remove height constraint and reset initial height
			if (isTransitioningTo100) {
				iframe.style.removeProperty('height');
				iframe.style.removeProperty('overflow');
				iframe.removeAttribute('scrolling');
				initialHeightRef.current = null;
				setInitialHeightState(null);
			}
		}

		// Update previous zoom ref for next transition detection
		previousZoomRef.current = zoom;
	}, []);

	/**
	 * Set zoom percentage with validation and persistence.
	 */
	const setZoomPercent = useCallback(
		(zoom: ZoomPercent) => {
			const clampedZoom = clampZoom(zoom);
			// Keep ref in sync immediately — effects run after paint; breakpoint
			// subscription may call syncCanvasHeader before the ref effect runs.
			zoomPercentRef.current = clampedZoom;
			setZoomPercentState(clampedZoom);
			saveZoomToStorage(clampedZoom);
			applyZoom(clampedZoom);
		},
		[applyZoom]
	);

	/**
	 * Reset zoom to default (100%).
	 */
	const resetZoom = useCallback(() => {
		setZoomPercent(DEFAULT_ZOOM);
	}, [setZoomPercent]);

	/**
	 * Zoom in by step amount.
	 */
	const zoomIn = useCallback(() => {
		setZoomPercent(zoomPercentRef.current + ZOOM_STEP);
	}, [setZoomPercent]);

	/**
	 * Zoom out by step amount.
	 */
	const zoomOut = useCallback(() => {
		setZoomPercent(zoomPercentRef.current - ZOOM_STEP);
	}, [setZoomPercent]);

	/**
	 * Calculate zoom level to fit content inside viewport (Figma-like).
	 * Measures viewport (visible canvas area inside Zoom View) and content bounds (unscaled),
	 * then calculates zoom to fit with padding and centers the content.
	 */
	const zoomToFit = useCallback(() => {
		const iframe = getEditorCanvasIframe();
		if (!iframe) {
			return;
		}

		const iframeDoc = getIframeDocument(iframe);
		if (!iframeDoc || !iframeDoc.body) {
			return;
		}

		// Get viewport: visible canvas area INSIDE the Zoom View window, excluding header/chrome
		// Use window dimensions as stable reference (not affected by zoom)
		// The container's getBoundingClientRect() changes with zoom, so we use window instead
		const visualEditorContainer = getVisualEditorContainer();
		if (!visualEditorContainer) {
			return;
		}

		// Get container rect for position reference, but use window for dimensions
		// Container rect changes with zoom, so we need stable dimensions
		const containerRect = visualEditorContainer.getBoundingClientRect();

		// Use window dimensions as the base (stable, not affected by zoom)
		// Subtract known UI elements: header (~64px), any padding
		// The container is positioned below the header, so we use its top position
		const headerHeight = containerRect.top || 64; // Fallback to 64px if top is 0
		const padding = 24; // 24px padding on all sides as per spec

		// Calculate available viewport space from window dimensions
		// Subtract header height and padding
		const viewportWidth = window.innerWidth - padding * 2;
		const viewportHeight = window.innerHeight - headerHeight - padding * 2;

		// Get content bounds: measure the content wrapper in UN-SCALED coordinates
		// Prefer .editor-styles-wrapper or .is-root-container as the stable root element
		const editorWrapper = iframeDoc.querySelector(
			'.editor-styles-wrapper'
		) as HTMLElement;
		const rootContainer = iframeDoc.querySelector(
			'.is-root-container'
		) as HTMLElement;
		const contentWrapper = editorWrapper || rootContainer || iframeDoc.body;

		// Get current zoom scale to convert scaled measurements to unscaled
		const currentScale = zoomPercentRef.current / 100;

		// Measure content bounds in UN-SCALED coordinates
		// Use scrollWidth/scrollHeight for intrinsic size (unscaled), or divide scaled rect by current scale
		let contentWidth = 0;
		let contentHeight = 0;

		if (contentWrapper) {
			// Method 1: Use scrollWidth/scrollHeight (intrinsic size, unscaled)
			// These should be unscaled regardless of current zoom
			contentWidth = Math.max(
				contentWrapper.scrollWidth || 0,
				iframeDoc.body.scrollWidth || 0,
				iframeDoc.documentElement?.scrollWidth || 0
			);
			contentHeight = Math.max(
				contentWrapper.scrollHeight || 0,
				calculateContentHeight(iframeDoc),
				iframeDoc.body.scrollHeight || 0,
				iframeDoc.documentElement?.scrollHeight || 0
			);

			// Method 2: If scrollWidth/Height don't work, use getBoundingClientRect and divide by scale
			if (contentWidth <= 0 || contentHeight <= 0) {
				const wrapperRect = contentWrapper.getBoundingClientRect();
				if (
					wrapperRect.width > 0 &&
					wrapperRect.height > 0 &&
					currentScale > 0
				) {
					contentWidth = wrapperRect.width / currentScale;
					contentHeight = wrapperRect.height / currentScale;
				}
			}
		}

		// If content bounds are invalid, don't zoom
		if (contentWidth <= 0 || contentHeight <= 0) {
			return;
		}

		// Calculate zoom to fit: min of width and height ratios
		// Formula: zoom = min((viewportWidth - 2*padding) / contentWidth, (viewportHeight - 2*padding) / contentHeight)
		const zoomForWidth = (viewportWidth / contentWidth) * 100;
		const zoomForHeight = (viewportHeight / contentHeight) * 100;
		const calculatedZoom = Math.min(zoomForWidth, zoomForHeight);

		// Round to 1% step for user-friendly display
		const roundedZoom = Math.round(calculatedZoom);

		// Clamp to valid zoom range
		const finalZoom = clampZoom(roundedZoom);

		// Apply zoom
		setZoomPercent(finalZoom);

		// Center content after zoom (Figma-like behavior)
		// Wait for zoom to be applied, then center
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const newScale = finalZoom / 100;
				const scaledContentWidth = contentWidth * newScale;
				const scaledContentHeight = contentHeight * newScale;

				// Calculate scroll offsets to center content
				// The iframe is centered horizontally by default (margin: auto), so we mainly need vertical centering
				// Scroll the container to center the scaled content
				if (visualEditorContainer) {
					// Calculate how much we need to scroll to center the content
					// If scaled content is larger than viewport, center it; otherwise scroll to top
					const targetScrollLeft =
						scaledContentWidth > containerRect.width
							? (scaledContentWidth - containerRect.width) / 2
							: 0;
					const targetScrollTop =
						scaledContentHeight > containerRect.height
							? (scaledContentHeight - containerRect.height) / 2
							: 0;

					visualEditorContainer.scrollTo({
						left: Math.max(0, targetScrollLeft),
						top: Math.max(0, targetScrollTop),
						behavior: 'smooth',
					});
				}
			});
		});
	}, [setZoomPercent]);

	/**
	 * Zoom to 50%.
	 */
	const zoomTo50 = useCallback(() => {
		setZoomPercent(50);
	}, [setZoomPercent]);

	// Apply zoom when it changes or on mount
	// Use a small delay on mount to ensure iframe is loaded
	useEffect(() => {
		const timeout = setTimeout(() => {
			applyZoom(zoomPercent);
		}, 0);

		return () => {
			clearTimeout(timeout);
		};
	}, [zoomPercent, applyZoom]);

	// Listen for reset messages from iframe header
	useEffect(() => {
		const handleMessage = (event: MessageEvent): void => {
			// Security: In production, you might want to check event.origin
			// For now, allowing all origins since it's same-origin within wp-admin
			const data = event.data;
			if (data && data.type === 'BLOCKERA_ZOOM_RESET') {
				setZoomPercent(DEFAULT_ZOOM);
				// Belt-and-suspenders: `setZoomPercent` → `applyZoom` also calls `syncCanvasHeader`,
				// but `applyZoom` can early-return in some paths; keep iframe header in sync with 100%.
				syncCanvasHeader(DEFAULT_ZOOM);
			}
		};

		window.addEventListener('message', handleMessage);

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, [setZoomPercent]);

	// Keep canvas header in sync with breakpoint changes (non-base needs header even at 100% zoom).
	useEffect(() => {
		let lastBreakpointId: string | null = null;
		// `subscribe` is registry-wide (fires on any store update). We only run
		// `syncCanvasHeader` when the current breakpoint id actually changes.
		const unsubscribe = subscribe(() => {
			const id =
				(
					select('blockera/extensions') as {
						getExtensionCurrentBlockStateBreakpoint?: () => string;
					}
				)?.getExtensionCurrentBlockStateBreakpoint?.() ?? 'desktop';
			if (id === lastBreakpointId) {
				return;
			}
			lastBreakpointId = id;
			// No arg: use loadZoomFromStorage() inside syncCanvasHeader — always
			// matches persisted zoom (updated synchronously in setZoomPercent).
			syncCanvasHeader();
		});

		// Initial sync.
		syncCanvasHeader();

		return () => {
			unsubscribe();
		};
	}, []);

	return {
		zoomPercent,
		setZoomPercent,
		resetZoom,
		zoomIn,
		zoomOut,
		zoomToFit,
		zoomTo50,
		initialHeight: initialHeightState,
	};
}
