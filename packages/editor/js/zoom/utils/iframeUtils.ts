/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { IFRAME_SELECTOR } from './constants';

// Import header styles as raw text for iframe injection
// Note: The ?raw suffix tells webpack to import this as a raw string
import headerStylesRaw from '../../preview-mode/header/style.css?raw';

// Store the imported styles (webpack will bundle this as a string)
// asset/source type returns the file content directly as a string
const headerStyles: string = (typeof headerStylesRaw === 'string' ? headerStylesRaw : '') || '';

/**
 * Get the editor canvas iframe element.
 * Works in both Post Editor and Site Editor.
 *
 * @returns The iframe element or null if not found.
 */
export function getEditorCanvasIframe(): HTMLIFrameElement | null {
	return document.querySelector(IFRAME_SELECTOR);
}

/**
 * Get the document inside an iframe.
 * Safely handles cross-origin restrictions.
 *
 * @param iframe - The iframe element to access.
 * @returns The iframe document or null if not accessible.
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
		return (
			iframe.contentDocument ||
			iframe.contentWindow?.document ||
			null
		);
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
 * @returns The visual editor container or null if not found.
 */
export function getVisualEditorContainer(): HTMLElement | null {
	return (
		document.querySelector('.editor-visual-editor') ||
		document.querySelector('.edit-post-visual-editor')
	);
}

/**
 * Calculate content height from iframe document.
 * Uses multiple methods to get the most accurate height.
 *
 * @param iframeDoc - The iframe document.
 * @returns The calculated content height, or 0 if unable to calculate.
 */
export function calculateContentHeight(iframeDoc: Document): number {
	if (!iframeDoc || !iframeDoc.body) {
		return 0;
	}

	// Try to get height from editor wrapper (most accurate for block editor)
	const editorWrapper = iframeDoc.querySelector('.editor-styles-wrapper') as HTMLElement | null;
	const postContent = iframeDoc.querySelector('.wp-block-post-content') as HTMLElement | null;

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

	// Create style element with zoom header styles
	// Uses PreviewHeader component structure for consistency
	// Styles are imported from package/js/preview-mode/header/style.css
	const style = iframeDoc.createElement('style');
	style.setAttribute('data-blockera-zoom-header-styles', 'true');

	// Use imported styles, or fallback to empty string if import failed
	const stylesContent = typeof headerStyles === 'string' && headerStyles.trim()
		? headerStyles
		: '';

	if (!stylesContent) {
		// @debug-ignore
		// eslint-disable-next-line no-console
		console.warn('Blockera Zoom: Header styles not loaded. CSS import may have failed.', {
			headerStylesType: typeof headerStyles,
			headerStylesLength: headerStyles?.length || 0,
		});
		// Don't return - inject empty styles to avoid breaking the header structure
		// The header will still render but without custom styles
	}

	style.textContent = stylesContent;
	iframeDoc.head.appendChild(style);
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

/**
 * Inject zoom header element into iframe body.
 * Creates a fixed header bar at the top showing zoom percentage and reset button.
 *
 * @param iframeDoc - The iframe document to inject header into.
 * @param zoomPercent - Current zoom percentage to display.
 */
export function injectZoomHeader(iframeDoc: Document, zoomPercent: number): void {
	if (!iframeDoc || !iframeDoc.body) {
		return;
	}

	// Check if header already exists to avoid duplicate injection
	const existingHeader = iframeDoc.querySelector(
		'.blockera-preview-header[data-blockera-zoom-header]'
	);
	if (existingHeader) {
		// Update zoom percentage if header already exists
		const zoomElement = existingHeader.querySelector('.blockera-preview-header__url-bar-content strong');
		if (zoomElement) {
			zoomElement.textContent = `${zoomPercent}%`;
		}
		return;
	}

	// Inject styles first
	injectZoomHeaderStyles(iframeDoc);

	// Create header element matching PreviewHeader structure
	const header = iframeDoc.createElement('div');
	header.className = 'blockera-preview-header';
	header.setAttribute('data-blockera-zoom-header', 'true');

	// Create browser icons (macOS-style traffic lights)
	const browserIcons = iframeDoc.createElement('div');
	browserIcons.className = 'blockera-preview-header__browser-icons';

	const closeDot = iframeDoc.createElement('button');
	closeDot.className = 'blockera-preview-header__close-dot';
	closeDot.setAttribute('type', 'button');
	closeDot.setAttribute('aria-label', 'Reset zoom to 100%');
	closeDot.addEventListener('click', () => {
		if (iframeDoc.defaultView && iframeDoc.defaultView.parent) {
			iframeDoc.defaultView.parent.postMessage(
				{ type: 'BLOCKERA_ZOOM_RESET' },
				'*'
			);
		}
	});

	const dot2 = iframeDoc.createElement('span');
	const dot3 = iframeDoc.createElement('span');

	browserIcons.appendChild(closeDot);
	browserIcons.appendChild(dot2);
	browserIcons.appendChild(dot3);

	// Create URL bar with zoom percentage
	const urlBar = iframeDoc.createElement('div');
	urlBar.className = 'blockera-preview-header__url-bar';

	const urlBarContent = iframeDoc.createElement('div');
	urlBarContent.className = 'blockera-preview-header__url-bar-content';
	urlBarContent.innerHTML = __('Zoom View', 'blockera-tabs') + `<span>·</span><strong>${zoomPercent}%</strong>`;

	urlBar.appendChild(urlBarContent);

	// Create actions container
	const actions = iframeDoc.createElement('div');
	actions.className = 'blockera-preview-header__actions';

	const closeButton = iframeDoc.createElement('span');
	closeButton.className = 'components-button blockera-preview-header__action-btn blockera-preview-header__action-btn--close has-icon';
	closeButton.innerHTML = __('Reset Zoom', 'blockera-tabs');
	closeButton.setAttribute('aria-label', __('Reset zoom to 100%', 'blockera-tabs'));

	closeButton.addEventListener('click', () => {
		if (iframeDoc.defaultView && iframeDoc.defaultView.parent) {
			iframeDoc.defaultView.parent.postMessage(
				{ type: 'BLOCKERA_ZOOM_RESET' },
				'*'
			);
		}
	});

	actions.appendChild(closeButton);

	header.appendChild(browserIcons);
	header.appendChild(urlBar);
	header.appendChild(actions);

	// Insert header at the beginning of body
	iframeDoc.body.insertBefore(header, iframeDoc.body.firstChild);

	// Add class to body to apply padding
	iframeDoc.body.classList.add('blockera-zoom-active');
	iframeDoc.documentElement.classList.add('blockera-zoom-active');
}

/**
 * Remove zoom header element from iframe body.
 *
 * @param iframeDoc - The iframe document to remove header from.
 */
export function removeZoomHeader(iframeDoc: Document): void {
	if (!iframeDoc || !iframeDoc.body) {
		return;
	}

	// Remove header element
	const header = iframeDoc.querySelector('.blockera-preview-header[data-blockera-zoom-header]');
	if (header) {
		header.remove();
	}

	// Remove body class
	iframeDoc.body.classList.remove('blockera-zoom-active');
	iframeDoc.documentElement.classList.remove('blockera-zoom-active');

	// Remove styles (optional - can keep for performance)
	// removeZoomHeaderStyles(iframeDoc);
}
