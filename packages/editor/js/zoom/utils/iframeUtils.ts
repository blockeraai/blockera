/* eslint-disable import/no-unresolved, import/no-duplicates */
/**
 * WordPress dependencies
 */
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { select } from '@wordpress/data';

import {
	DEFAULT_ZOOM,
	EDITOR_ZOOM_COMPAT_STYLE_ATTR,
	IFRAME_SELECTOR,
} from './constants';
import CanvasHeader from '../components/CanvasHeader';
import { loadZoomFromStorage } from './storage';

// Import header styles as raw text for iframe injection
// Note: The ?raw suffix tells webpack to import this as a raw string
import headerStylesRaw from '../../preview-mode/header/style.css?raw';
/* eslint-enable import/no-unresolved, import/no-duplicates */

// Extract string from raw import (handles both direct string and module.default)
const headerStyles: string = (() => {
	if (typeof headerStylesRaw === 'string' && headerStylesRaw.trim()) {
		return headerStylesRaw;
	}
	const mod = headerStylesRaw as { default?: string } | undefined;
	if (mod?.default && typeof mod.default === 'string' && mod.default.trim()) {
		return mod.default;
	}
	return '';
})();

/**
 * Get the editor canvas iframe element.
 * Works in both Post Editor and Site Editor.
 *
 * @return The iframe element or null if not found.
 */
export function getEditorCanvasIframe(): HTMLIFrameElement | null {
	return document.querySelector(IFRAME_SELECTOR);
}

/**
 * Get the document inside an iframe.
 * Safely handles cross-origin restrictions.
 *
 * @param iframe - The iframe element to access.
 * @return The iframe document or null if not accessible.
 */
export function getIframeDocument(
	iframe: HTMLIFrameElement | null
): Document | null {
	if (!iframe) {
		return null;
	}

	try {
		// Try multiple methods to access iframe document
		// This handles different browser implementations
		return iframe.contentDocument || iframe.contentWindow?.document || null;
	} catch {
		// Cross-origin iframe or other access error
		// Return null to indicate document is not accessible
		return null;
	}
}

/**
 * Get the visual editor container element.
 * Works in both Post Editor and Site Editor.
 *
 * @return The visual editor container or null if not found.
 */
export function getVisualEditorContainer(): HTMLElement | null {
	return (
		document.querySelector('.editor-visual-editor') ||
		document.querySelector('.edit-post-visual-editor')
	);
}

/**
 * Apply Blockera canvas zoom to core block-editor UI that renders in the host
 * document while anchoring to the scaled iframe. Those Popovers do not inherit
 * iframe scale; we inject one `<style>` that scales `.components-popover__content`
 * with `transform: scale()` (Floating UI keeps `translate` on the Popover wrapper).
 *
 * Compatibility layers (add more selector groups here as needed):
 * 1. Grid visualizer — triple `.block-editor-grid-visualizer` (core grid/style.scss).
 * 2. Grid item resizer — triple `.block-editor-grid-item-resizer` (same Popover pattern).
 *
 * @param zoomPercent - Editor zoom 10–250; at {@link DEFAULT_ZOOM} the injected style is removed.
 */
export function editorZoomCompatibility(zoomPercent: number): void {
	if (typeof document === 'undefined' || !document.head) {
		return;
	}

	const selector = `style[${EDITOR_ZOOM_COMPAT_STYLE_ATTR}]`;
	const existing = document.querySelector(selector);

	if (zoomPercent === DEFAULT_ZOOM) {
		existing?.remove();
		return;
	}

	const scale = zoomPercent / DEFAULT_ZOOM;
	const popoverContent = '.components-popover__content';

	// Triple classes match core’s z-index / specificity hooks.
	const gridVisualizer = `.block-editor-grid-visualizer.block-editor-grid-visualizer.block-editor-grid-visualizer ${popoverContent}`;
	const gridItemResizer = `.block-editor-grid-item-resizer.block-editor-grid-item-resizer.block-editor-grid-item-resizer ${popoverContent}`;

	const css = `${gridItemResizer},${gridVisualizer}{transform:scale(${scale});transform-origin:0 0;}`;

	if (existing) {
		existing.textContent = css;
		return;
	}

	const style = document.createElement('style');
	style.setAttribute(EDITOR_ZOOM_COMPAT_STYLE_ATTR, 'true');
	style.textContent = css;
	document.head.appendChild(style);
}

/**
 * Calculate content height from iframe document.
 * Uses multiple methods to get the most accurate height.
 *
 * @param iframeDoc - The iframe document.
 * @return The calculated content height, or 0 if unable to calculate.
 */
export function calculateContentHeight(iframeDoc: Document): number {
	if (!iframeDoc || !iframeDoc.body) {
		return 0;
	}

	// Try to get height from editor wrapper (most accurate for block editor)
	const editorWrapper = iframeDoc.querySelector(
		'.editor-styles-wrapper'
	) as HTMLElement | null;
	const postContent = iframeDoc.querySelector(
		'.wp-block-post-content'
	) as HTMLElement | null;

	let height = 0;

	// Check body scrollHeight and offsetHeight
	if (iframeDoc.body) {
		height = Math.max(
			iframeDoc.body.scrollHeight || 0,
			iframeDoc.body.offsetHeight || 0
		);
	}

	// Check editor wrapper if available
	if (editorWrapper) {
		const wrapperHeight = Math.max(
			editorWrapper.scrollHeight || 0,
			editorWrapper.offsetHeight || 0
		);

		if (wrapperHeight > 0) {
			height = Math.max(height, wrapperHeight);
		}
	}

	// Check post content if available
	if (postContent) {
		const postHeight = Math.max(
			postContent.scrollHeight || 0,
			postContent.offsetHeight || 0
		);

		if (postHeight > 0) {
			height = Math.max(height, postHeight);
		}
	}

	// Fallback to documentElement if body height is 0
	if (height === 0 && iframeDoc.documentElement) {
		height = Math.max(
			iframeDoc.documentElement.scrollHeight || 0,
			iframeDoc.documentElement.offsetHeight || 0
		);
	}

	return height;
}

/**
 * Inject CSS override to fix editor-styles-wrapper::after height.
 * Overrides the 40vh height with 300px to prevent viewport-based height issues.
 *
 * @param iframeDoc - The iframe document to inject style into.
 */
export function injectEditorStylesWrapperOverride(iframeDoc: Document): void {
	if (!iframeDoc || !iframeDoc.head) {
		return;
	}

	// Check if style already exists to avoid duplicate injection
	const existingStyle = iframeDoc.querySelector(
		'style[data-blockera-zoom-editor-styles-override]'
	);
	if (existingStyle) {
		return;
	}

	// Create style element with override
	const style = iframeDoc.createElement('style');
	style.setAttribute('data-blockera-zoom-editor-styles-override', 'true');
	style.textContent = `
		:root :where(.editor-styles-wrapper)::after {
			content: "" !important;
			display: block !important;
			height: 300px !important;
		}
	`;

	iframeDoc.head.appendChild(style);
}

/**
 * Remove CSS override for editor-styles-wrapper::after height.
 * Restores original behavior when zoom is reset to 100%.
 *
 * @param iframeDoc - The iframe document to remove style from.
 */
export function removeEditorStylesWrapperOverride(iframeDoc: Document): void {
	if (!iframeDoc) {
		return;
	}

	const existingStyle = iframeDoc.querySelector(
		'style[data-blockera-zoom-editor-styles-override]'
	);
	if (existingStyle) {
		existingStyle.remove();
	}
}

/**
 * Inject height monitoring script into iframe.
 * The script calculates content height and posts messages to parent window.
 *
 * @param iframeDoc - The iframe document to inject script into.
 */
export function injectHeightMonitoringScript(iframeDoc: Document): void {
	if (!iframeDoc || !iframeDoc.head) {
		return;
	}

	// Check if script already exists to avoid duplicate injection
	const existingScript = iframeDoc.querySelector(
		'script[data-blockera-zoom-height-monitor]'
	);
	if (existingScript) {
		return;
	}

	// Create script that monitors content height and posts messages
	const script = iframeDoc.createElement('script');
	script.setAttribute('data-blockera-zoom-height-monitor', 'true');
	script.textContent = `
		(function() {
			if (!window.parent || !document.body) {
				return;
			}

			let paused = false;
			let updateTimeout = null;

			// Listen for pause/resume messages from parent
			window.addEventListener('message', function(event) {
				if (event.data && event.data.type === 'BLOCKERA_ZOOM_PAUSE_UPDATES') {
					paused = event.data.pause === true;
				}
			});

			function sendHeight() {
				if (paused) {
					return;
				}

				// Clear any pending update
				if (updateTimeout) {
					clearTimeout(updateTimeout);
				}

				// Debounce height updates to prevent rapid-fire messages
				updateTimeout = setTimeout(function() {
					try {
						// Calculate content height
						let height = 0;
						const body = document.body;
						const editorWrapper = document.querySelector('.editor-styles-wrapper');
						const postContent = document.querySelector('.wp-block-post-content');

						if (body) {
							height = Math.max(
								body.scrollHeight || 0,
								body.offsetHeight || 0
							);
						}

						if (editorWrapper) {
							const wrapperHeight = Math.max(
								editorWrapper.scrollHeight || 0,
								editorWrapper.offsetHeight || 0
							);
							if (wrapperHeight > 0) {
								height = Math.max(height, wrapperHeight);
							}
						}

						if (postContent) {
							const postHeight = Math.max(
								postContent.scrollHeight || 0,
								postContent.offsetHeight || 0
							);
							if (postHeight > 0) {
								height = Math.max(height, postHeight);
							}
						}

						if (height === 0 && document.documentElement) {
							height = Math.max(
								document.documentElement.scrollHeight || 0,
								document.documentElement.offsetHeight || 0
							);
						}

						// Send height to parent window
						if (height > 0) {
							window.parent.postMessage({
								type: 'IFRAME_HEIGHT',
								height: height
							}, '*');
						}
					} catch (e) {
						// Silently fail - iframe may have become inaccessible
					}
				}, 100);
			}

			// Use ResizeObserver to watch for content size changes
			if (window.ResizeObserver && document.body) {
				const resizeObserver = new ResizeObserver(sendHeight);
				resizeObserver.observe(document.body);

				// Also observe editor wrapper if it exists
				const editorWrapper = document.querySelector('.editor-styles-wrapper');
				if (editorWrapper) {
					resizeObserver.observe(editorWrapper);
				}

				// Also observe post content if it exists
				const postContent = document.querySelector('.wp-block-post-content');
				if (postContent) {
					resizeObserver.observe(postContent);
				}
			}

			// Use MutationObserver to watch for DOM changes
			if (window.MutationObserver && document.body) {
				const mutationObserver = new MutationObserver(sendHeight);
				mutationObserver.observe(document.body, {
					childList: true,
					subtree: true,
					attributes: true,
					attributeFilter: ['style', 'class']
				});
			}

			// Send initial height
			if (document.readyState === 'complete') {
				sendHeight();
			} else {
				window.addEventListener('load', sendHeight, { once: true });
			}

			// Also send height on window resize
			window.addEventListener('resize', sendHeight);
		})();
	`;

	iframeDoc.head.appendChild(script);
}

/**
 * Inject zoom header styles into iframe.
 * Styles for the header bar that appears when zoomed.
 *
 * Styles are imported from package/js/preview-mode/header/style.css
 * This ensures a single source of truth - any changes to the CSS file
 * are automatically reflected here.
 *
 * @param iframeDoc - The iframe document to inject styles into.
 */
export function injectZoomHeaderStyles(iframeDoc: Document): void {
	if (!iframeDoc || !iframeDoc.head) {
		return;
	}

	// Check if styles already exist to avoid duplicate injection
	const existingStyle = iframeDoc.querySelector(
		'style[data-blockera-zoom-header-styles]'
	);
	if (existingStyle) {
		return;
	}

	// Use CSS from preview-mode/header/style.css only (single source of truth)
	const MIN_VALID_CSS_LENGTH = 200;
	const rawLen =
		typeof headerStyles === 'string' ? headerStyles.trim().length : 0;
	const stylesContent =
		rawLen >= MIN_VALID_CSS_LENGTH ? headerStyles.trim() : '';

	const url =
		typeof window !== 'undefined' &&
		(
			window as Window & {
				blockeraPluginData?: { previewHeaderStyleUrl?: string };
			}
		)?.blockeraPluginData?.previewHeaderStyleUrl;

	if (stylesContent) {
		const style = iframeDoc.createElement('style');
		style.setAttribute('data-blockera-zoom-header-styles', 'true');
		style.textContent = stylesContent;
		iframeDoc.head.appendChild(style);
		return;
	}

	// Bundled CSS invalid: load from file URL (single source of truth)
	if (url) {
		fetch(url)
			.then((r) =>
				r.ok ? r.text() : Promise.reject(new Error('Fetch failed'))
			)
			.then((css) => {
				const hasHead = !!iframeDoc.head;
				const existing = !!iframeDoc.querySelector(
					'style[data-blockera-zoom-header-styles]'
				);
				// Only inject if response looks like header CSS (contains zoom header selector); avoid injecting wrong file (e.g. full editor bundle)
				const isHeaderCss =
					css.includes('.blockera-canvas-header') &&
					css.includes('blockera-zoom-active');
				if (!hasHead || existing) {
					return;
				}
				if (!isHeaderCss) {
					// @debug-ignore
					// eslint-disable-next-line no-console
					console.warn(
						'Blockera Zoom: Fetched CSS is not preview-header (missing .blockera-canvas-header). Run build so dist/editor/preview-header.css exists.'
					);
					return;
				}
				const style = iframeDoc.createElement('style');
				style.setAttribute('data-blockera-zoom-header-styles', 'true');
				style.textContent = css;
				iframeDoc.head.appendChild(style);
			})
			.catch(() => {
				// @debug-ignore
				// eslint-disable-next-line no-console
				console.warn(
					'Blockera Zoom: Failed to load header styles from file.'
				);
			});
	}
}

/**
 * Remove zoom header styles from iframe.
 *
 * @param iframeDoc - The iframe document to remove styles from.
 */
export function removeZoomHeaderStyles(iframeDoc: Document): void {
	if (!iframeDoc) {
		return;
	}

	const existingStyle = iframeDoc.querySelector(
		'style[data-blockera-zoom-header-styles]'
	);
	if (existingStyle) {
		existingStyle.remove();
	}
}

/** Store React root and container per iframe document for canvas header */
const canvasHeaderMap = new WeakMap<
	Document,
	{ root: ReturnType<typeof createRoot>; container: HTMLDivElement }
>();

/**
 * Post message to parent window to reset zoom.
 * Used by ZoomHeader when user clicks reset (traffic light or Reset Zoom button).
 */
function postZoomReset(iframeDoc: Document): void {
	if (iframeDoc.defaultView?.parent) {
		iframeDoc.defaultView.parent.postMessage(
			{ type: 'BLOCKERA_ZOOM_RESET' },
			'*'
		);
	}
}

function postBreakpointResetToBase(iframeDoc: Document): void {
	if (iframeDoc.defaultView?.parent) {
		iframeDoc.defaultView.parent.postMessage(
			{ type: 'BLOCKERA_BREAKPOINT_RESET_TO_BASE' },
			'*'
		);
	}
}

/**
 * Inject canvas header into iframe body using React and PreviewHeader.
 * Creates a fixed header bar at the top showing breakpoint info and, when zoomed, zoom controls.
 *
 * @param iframeDoc - The iframe document to inject header into.
 * @param zoomPercent - Current zoom percentage (used for combined view when zoomed).
 */
function injectCanvasHeader(iframeDoc: Document, zoomPercent: number): void {
	if (!iframeDoc || !iframeDoc.body) {
		return;
	}

	const existing = canvasHeaderMap.get(iframeDoc);
	if (existing) {
		// Header already mounted: re-render with updated zoom percentage
		existing.root.render(
			createElement(CanvasHeader, {
				zoomPercent,
				onResetZoom: () => postZoomReset(iframeDoc),
				onResetBreakpointToBase: () =>
					postBreakpointResetToBase(iframeDoc),
			})
		);
		return;
	}

	// Inject styles first
	injectZoomHeaderStyles(iframeDoc);

	// Create container for React root
	const container = iframeDoc.createElement('div');
	container.setAttribute('data-blockera-canvas-header-root', 'true');

	// Insert at the beginning of body
	iframeDoc.body.insertBefore(container, iframeDoc.body.firstChild);

	// Add class to body to apply padding
	iframeDoc.body.classList.add('blockera-zoom-active');
	iframeDoc.documentElement.classList.add('blockera-zoom-active');

	// Create React root and render CanvasHeader (uses PreviewHeader)
	const root = createRoot(container);
	root.render(
		createElement(CanvasHeader, {
			zoomPercent,
			onResetZoom: () => postZoomReset(iframeDoc),
			onResetBreakpointToBase: () => postBreakpointResetToBase(iframeDoc),
		})
	);

	canvasHeaderMap.set(iframeDoc, { root, container });
}

/**
 * Remove canvas header from iframe body.
 * Unmounts React root and removes container.
 *
 * @param iframeDoc - The iframe document to remove header from.
 */
function removeCanvasHeader(iframeDoc: Document): void {
	if (!iframeDoc || !iframeDoc.body) {
		return;
	}

	const existing = canvasHeaderMap.get(iframeDoc);
	if (existing) {
		existing.root.unmount();
		existing.container.remove();
		canvasHeaderMap.delete(iframeDoc);
	}

	// Remove body class
	iframeDoc.body.classList.remove('blockera-zoom-active');
	iframeDoc.documentElement.classList.remove('blockera-zoom-active');
}

type BreakpointInfo = {
	base?: boolean;
};

type BlockeraExtensionsSelect = {
	getExtensionCurrentBlockStateBreakpoint?: () => string;
};

type BlockeraEditorSelect = {
	getBreakpoints?: () => Record<string, BreakpointInfo>;
};

/**
 * Ensure the in-iframe canvas header is mounted/unmounted based on:
 * - non-base breakpoint (responsive frame active)
 * - zoomed canvas (zoom != 100)
 *
 * When `zoomPercent` is omitted, reads from `loadZoomFromStorage()` so the value
 * stays in sync with `setZoomPercent` (which persists synchronously). Callers
 * that have an authoritative zoom value (e.g. `applyZoom`) may pass it explicitly.
 *
 * Safe to call often; uses WeakMap + cheap store reads.
 */
export function syncCanvasHeader(zoomPercent?: number): void {
	const iframe = getEditorCanvasIframe();
	if (!iframe) {
		return;
	}

	const iframeDoc = getIframeDocument(iframe);
	if (!iframeDoc) {
		return;
	}

	const z =
		typeof zoomPercent === 'number' && !Number.isNaN(zoomPercent)
			? zoomPercent
			: loadZoomFromStorage();
	const isZoomed = z !== 100;

	const extensionsSelect = select('blockera/extensions') as
		| BlockeraExtensionsSelect
		| undefined;
	const editorSelect = select('blockera/editor') as
		| BlockeraEditorSelect
		| undefined;

	const breakpointId =
		extensionsSelect?.getExtensionCurrentBlockStateBreakpoint?.() ??
		'desktop';
	const breakpoints = editorSelect?.getBreakpoints?.() ?? {};
	const info = breakpoints[breakpointId] ?? {};
	const isBase = info.base === true;

	if (isZoomed || !isBase) {
		injectCanvasHeader(iframeDoc, z);
	} else {
		removeCanvasHeader(iframeDoc);
	}
}
