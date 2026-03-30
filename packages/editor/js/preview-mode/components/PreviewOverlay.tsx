/**
 * WordPress dependencies
 */
import {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
	createPortal,
} from '@wordpress/element';
// eslint-disable-next-line import/named
import { ProgressBar } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { ReactNode, CSSProperties } from 'react';

/**
 * Blockera dependencies
 */
import { Button } from '@blockera/controls';
import { classNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { PreviewHeader } from '../header';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { HIDE_ADMIN_BAR_ARG } from '../../hooks/constants';
import {
	loadZoomFromStorage,
	saveZoomToStorage,
} from '../../zoom/utils/storage';
import { handleZoomKeyboardEvent } from '../../zoom/utils/zoomKeyboard';
import {
	ZOOM_CSS_VAR,
	ZOOMED_OUT_CLASS,
	DEFAULT_ZOOM,
	MIN_IFRAME_HEIGHT,
	MAX_REASONABLE_HEIGHT,
} from '../../zoom/utils/constants';
import {
	injectHeightMonitoringScript,
	getIframeDocument,
} from '../../zoom/utils/iframeUtils';

/**
 * Custom reload icon SVG element.
 * A circular arrow indicating refresh/reload action.
 */
const reloadIcon = (
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M17.334 3.2124C17.5369 3.19772 17.7503 3.24893 17.9199 3.37744C18.0926 3.50831 18.211 3.71255 18.2305 3.97998L18.4736 7.25732L18.4766 7.34326C18.4739 7.77203 18.1435 8.14556 17.6846 8.17529L17.6836 8.17431L14.4004 8.41845C14.1336 8.43777 13.9149 8.34984 13.7607 8.19775C13.6097 8.04839 13.5283 7.84489 13.5137 7.64208C13.4991 7.43918 13.5501 7.22572 13.6787 7.05615C13.8097 6.88358 14.0139 6.76601 14.2812 6.74658L15.6494 6.64404C11.4574 3.75754 5.52871 6.72049 5.52832 11.9907C5.52832 17.7385 12.5106 20.6327 16.5762 16.5669C17.7476 15.3954 18.4707 13.7778 18.4707 11.9907C18.4708 11.7227 18.5744 11.5107 18.7373 11.3677C18.8974 11.2272 19.1068 11.1597 19.3105 11.1597C19.5143 11.1597 19.7237 11.2272 19.8838 11.3677C20.0466 11.5107 20.1503 11.7228 20.1504 11.9907C20.1504 16.4919 16.5002 20.1411 12 20.1411C7.49879 20.1411 3.84961 16.4909 3.84961 11.9907C3.85 5.35868 11.3296 1.58562 16.6465 5.2954L16.5576 4.09912C16.5383 3.83255 16.6263 3.61448 16.7783 3.46044C16.9277 3.30919 17.131 3.22711 17.334 3.2124Z" />
	</svg>
);

/**
 * Props for PreviewOverlay component.
 */
export interface PreviewOverlayProps {
	/** The preview URL to load in the iframe. */
	url: string;
	/** Callback to close the overlay. */
	onClose: () => void;
	/** Whether the overlay is currently closing (for animation). */
	isClosing: boolean;
}

/**
 * PreviewOverlay component that displays the preview iframe.
 * Handles loading state, dynamic breakpoint sizing, navigation blocking, and ESC key close.
 *
 * @param props - Component props.
 * @return The overlay portal or null if container not found.
 */

export default function PreviewOverlay({
	url,
	onClose,
	isClosing,
}: PreviewOverlayProps): ReactNode {
	const [isLoading, setIsLoading] = useState(true);
	const [container, setContainer] = useState<HTMLElement | null>(null);
	const [loadProgress, setLoadProgress] = useState(0);
	// Track reload animation state for the spinning icon effect
	// Start spinning immediately on mount - will stop when iframe loads
	const [isReloading, setIsReloading] = useState(true);
	// Track opening animation state to prevent zoom conflicts
	const [isOpening, setIsOpening] = useState(true);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const reloadBtnRef = useRef<HTMLButtonElement>(null);
	const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
		null
	);
	// Track current zoom percentage for preview iframe
	const [zoomPercent, setZoomPercent] = useState<number>(() =>
		loadZoomFromStorage()
	);
	// Ref to track zoom for polling (avoids stale closure)
	const zoomPercentRef = useRef(zoomPercent);

	// Ref to track spinning state synchronously (avoids stale closure issues)
	// Initialize to true since we spin on initial load
	const isSpinningRef = useRef(true);

	// Store reference to beforeunload handler so we can remove it before reloading
	const beforeUnloadHandlerRef = useRef<
		((event: BeforeUnloadEvent) => void) | null
	>(null);

	// Stable iframe keydown listener delegates to latest logic (zoom + reload); parent window
	// does not receive key events when focus is inside the preview iframe.
	const iframeKeydownDispatchRef = useRef<(event: KeyboardEvent) => void>(
		() => {}
	);
	const stableIframeKeydownListener = useMemo(
		() => (event: KeyboardEvent) => {
			iframeKeydownDispatchRef.current(event);
		},
		[]
	);

	// Track preview iframe height for scrollbar management
	const previewHeightRef = useRef<number | null>(null);
	const [previewIframeHeight, setPreviewIframeHeight] = useState<
		number | null
	>(null);
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Get current breakpoint data from Blockera stores
	const { breakpointType, maxWidth } = useBreakpoint();

	// Process URL for display and styling, and create iframe URL with admin bar hidden
	// Process URL for display (styled slashes) and create iframe URL with admin bar hidden
	const { processedUrl, isSecure, iframeUrl } = useMemo(() => {
		const secure = url.startsWith('https://');
		// Remove protocol, then trim a single trailing slash unless it's the only character left
		// Also clean up 404 page URLs by removing the timestamp suffix (e.g., -1766640622715)
		const display = url
			.replace(/^https?:\/\//, '')
			.replace(/\/$/, '')
			.replace(/this-is-a-404-page-\d+$/, '404');
		const processed = display.replace(/\//g, '<span>/</span>');

		// Create iframe URL with HIDE_ADMIN_BAR_ARG query parameter to hide admin bar
		const urlObj = new URL(url);
		urlObj.searchParams.set(HIDE_ADMIN_BAR_ARG, '1');
		const iframe = urlObj.toString();

		return { processedUrl: processed, isSecure: secure, iframeUrl: iframe };
	}, [url]);

	// Open current URL in a new browser tab
	const handleOpenInNewTab = useCallback((): void => {
		window.open(url, '_blank', 'noopener,noreferrer');
	}, [url]);

	// Reload the iframe by removing beforeunload handler first to avoid dialog
	const handleReload = useCallback((): void => {
		const iframeWindow = iframeRef.current?.contentWindow;
		const iframe = iframeRef.current;
		if (!iframeWindow || !iframe) {
			return;
		}

		setIsLoading(true);
		setLoadProgress(0);

		// Reset iframe height to allow fresh measurement after reload
		iframe.style.removeProperty('height');
		iframe.style.removeProperty('overflow');
		previewHeightRef.current = null;

		// Start the reload icon spin animation - will stop when iframe loads
		// Use ref to track synchronously (avoids stale closure in handleIframeLoadComplete)
		isSpinningRef.current = true;
		setIsReloading(true);

		// Sync zoom state before reloading
		const currentZoom = loadZoomFromStorage();
		setZoomPercent(currentZoom);

		try {
			// Remove beforeunload handler before reloading to prevent dialog
			if (beforeUnloadHandlerRef.current) {
				iframeWindow.removeEventListener(
					'beforeunload',
					beforeUnloadHandlerRef.current
				);
				beforeUnloadHandlerRef.current = null;
			}

			// Reload the iframe - handler will be re-added on load
			iframeWindow.location.reload();
		} catch {
			// Cross-origin fallback: reset src attribute
			if (iframeRef.current) {
				iframeRef.current.src = iframeRef.current.src;
			}
		}
	}, []);

	// Handle close - animation is managed by parent component
	const handleClose = useCallback((): void => {
		onClose();
	}, [onClose]);

	// Find and set the overlay mount container
	useEffect(() => {
		const editorContainer = document.querySelector(
			'.interface-interface-skeleton__editor'
		) as HTMLElement | null;
		if (editorContainer) {
			setContainer(editorContainer);
		}
	}, []);

	// Add body class when preview mode is open to enable CSS targeting
	// Remove class instantly when closing starts (not waiting for unmount)
	useEffect(() => {
		if (isClosing) {
			// Remove class immediately when closing starts
			document.body.classList.remove('blockera-preview-mode-open');
			return;
		}

		// Add class when overlay is open
		document.body.classList.add('blockera-preview-mode-open');

		return () => {
			// Cleanup on unmount (safety fallback)
			document.body.classList.remove('blockera-preview-mode-open');
		};
	}, [isClosing]);

	// ESC key handler on main document to close overlay from anywhere
	useEffect(() => {
		const handleEscKey = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') {
				event.preventDefault();
				event.stopPropagation();
				handleClose();
			}
		};

		document.addEventListener('keydown', handleEscKey, true);

		return () => {
			document.removeEventListener('keydown', handleEscKey, true);
		};
	}, [handleClose]);

	// Prevent Command+K (Cmd+K / Ctrl+K) from opening command bar when preview mode is open
	useEffect(() => {
		const handleCommandK = (event: KeyboardEvent): void => {
			const isCommandK =
				event.key === 'k' && (event.metaKey || event.ctrlKey);

			if (isCommandK) {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
			}
		};

		// Use capture phase to intercept before WordPress command bar handler
		document.addEventListener('keydown', handleCommandK, true);

		return () => {
			document.removeEventListener('keydown', handleCommandK, true);
		};
	}, []);

	// When preview is open but focus is not inside the preview iframe, browser refresh shortcuts
	// (F5, Cmd/Ctrl+R) would reload the whole editor tab. Intercept and reload the preview iframe only.
	// When focus is inside the iframe, ownerDocument.activeElement is the iframe element and the iframe's
	// own keydown handler (see iframeKeydownDispatchRef) already handles reload.
	useEffect(() => {
		const handleDocumentRefreshShortcut = (event: KeyboardEvent): void => {
			const iframe = iframeRef.current;
			if (!iframe) {
				return;
			}

			if (iframe.ownerDocument.activeElement === iframe) {
				return;
			}

			const isF5 = event.key === 'F5';
			const isModifierR =
				(event.metaKey || event.ctrlKey) &&
				(event.key === 'r' || event.key === 'R');

			if (!isF5 && !isModifierR) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			handleReload();
		};

		document.addEventListener(
			'keydown',
			handleDocumentRefreshShortcut,
			true
		);

		return () => {
			document.removeEventListener(
				'keydown',
				handleDocumentRefreshShortcut,
				true
			);
		};
	}, [handleReload]);

	// Simulate loading progress while iframe is loading
	// Progress goes from 0 to ~90% gradually, then jumps to 100% when iframe loads
	useEffect(() => {
		if (!isLoading) {
			return;
		}

		// Clear any existing interval
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current);
		}

		const startTime = Date.now();
		let animationId: number;

		const updateProgress = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(90, (elapsed / 2000) * 90); // 90% over 2 seconds

			setLoadProgress(progress);

			if (progress < 90) {
				animationId = requestAnimationFrame(updateProgress);
			}
		};

		animationId = requestAnimationFrame(updateProgress);

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	}, [isLoading]);

	// Block link clicks in iframe to prevent navigation
	const blockIframeLinks = useCallback((iframeDoc: Document): void => {
		iframeDoc.addEventListener(
			'click',
			(event: Event) => {
				const target = event.target as HTMLElement;
				const anchorLink = target.closest(
					'a'
				) as HTMLAnchorElement | null;
				if (anchorLink?.href) {
					event.preventDefault();
					event.stopPropagation();
				}
			},
			true
		);
	}, []);

	// Block form submissions in iframe
	const blockIframeForms = useCallback((iframeDoc: Document): void => {
		iframeDoc.addEventListener(
			'submit',
			(event: Event) => {
				event.preventDefault();
				event.stopPropagation();
			},
			true
		);
	}, []);

	// Block window navigation via beforeunload
	const blockIframeNavigation = useCallback((iframeWindow: Window): void => {
		const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
			event.preventDefault();
		};
		beforeUnloadHandlerRef.current = handleBeforeUnload;
		iframeWindow.addEventListener('beforeunload', handleBeforeUnload);
	}, []);

	/**
	 * Apply height to preview iframe based on content height.
	 * Prevents double scrollbars by setting iframe height to actual content height.
	 * Only the container should have scrollbar, not the iframe tag.
	 *
	 * @param height - Content height from iframe.
	 */
	const applyPreviewIframeHeight = useCallback((height: number): void => {
		const iframe = iframeRef.current;
		if (!iframe) {
			return;
		}

		// Validate height is reasonable
		if (height <= 0 || height > MAX_REASONABLE_HEIGHT) {
			return;
		}

		const finalHeight = Math.max(MIN_IFRAME_HEIGHT, height);

		// Temporarily pause iframe updates to prevent feedback loop
		const iframeDoc = getIframeDocument(iframe);
		if (iframeDoc?.defaultView) {
			iframeDoc.defaultView.postMessage(
				{ type: 'BLOCKERA_ZOOM_PAUSE_UPDATES', pause: true },
				'*'
			);
		}

		// Set height with !important to override any conflicting styles
		// This removes the duplicate scrollbar - only container will scroll
		iframe.style.setProperty('height', `${finalHeight}px`, 'important');
		iframe.setAttribute('scrolling', 'no');
		iframe.style.setProperty('overflow', 'hidden', 'important');

		// Store height for reference and state
		previewHeightRef.current = finalHeight;
		setPreviewIframeHeight(finalHeight);

		// Resume iframe updates after a delay
		setTimeout(() => {
			if (iframeDoc?.defaultView) {
				iframeDoc.defaultView.postMessage(
					{ type: 'BLOCKERA_ZOOM_PAUSE_UPDATES', pause: false },
					'*'
				);
			}
		}, 1000);
	}, []);

	/**
	 * Handle height messages from preview iframe.
	 * Debounces updates to prevent rapid-fire changes.
	 */
	const handlePreviewHeightMessage = useCallback(
		(event: MessageEvent): void => {
			// Security: In production, you might want to check event.origin
			// For now, allowing all origins since it's same-origin within wp-admin
			const data = event.data;
			if (!data || data.type !== 'IFRAME_HEIGHT') {
				return;
			}

			const height = Number(data.height) || 0;
			if (height > 0) {
				// Clear any pending update
				if (debounceTimeoutRef.current) {
					clearTimeout(debounceTimeoutRef.current);
				}

				// Debounce height updates to prevent rapid-fire changes
				debounceTimeoutRef.current = setTimeout(() => {
					applyPreviewIframeHeight(height);
				}, 100);
			}
		},
		[applyPreviewIframeHeight]
	);

	// Setup iframe event handlers and navigation blocking
	const setupIframeHandlers = useCallback((): void => {
		try {
			const iframeDoc = iframeRef.current?.contentDocument;
			const iframeWindow = iframeRef.current?.contentWindow;

			if (iframeDoc) {
				// Inject height monitoring script into preview iframe
				// This script will post messages with content height
				injectHeightMonitoringScript(iframeDoc);

				// Capture zoom + reload while focus is inside the preview iframe (parent window
				// does not receive these keydown events).
				iframeDoc.addEventListener(
					'keydown',
					stableIframeKeydownListener,
					true
				);

				// Block navigation
				blockIframeLinks(iframeDoc);
				blockIframeForms(iframeDoc);

				if (iframeWindow) {
					blockIframeNavigation(iframeWindow);
				}
			}
		} catch {
			// Cross-origin iframe - can't access content
			// This is expected in some configurations and is handled gracefully
			// @debug-ignore
			// eslint-disable-next-line no-console
			console.info(
				'Blockera Preview: Unable to block navigation in cross-origin iframe'
			);
		}
	}, [
		blockIframeLinks,
		blockIframeForms,
		blockIframeNavigation,
		stableIframeKeydownListener,
	]);

	/**
	 * Apply zoom transform to preview iframe container.
	 * Syncs with current zoom state from localStorage and applies CSS transform.
	 * Uses inline styles with !important for maximum specificity to override any conflicting styles.
	 * CSS transitions are handled via stylesheet (respects prefers-reduced-motion).
	 *
	 * @param zoom - Zoom percentage (10-200).
	 */
	const applyPreviewZoom = useCallback((zoom: number): void => {
		const zoomContainer = containerRef.current;
		if (!zoomContainer) {
			return;
		}

		const scale = zoom / 100;
		const isZoomed = zoom !== DEFAULT_ZOOM;

		// Use requestAnimationFrame to ensure DOM is ready and transitions work smoothly
		requestAnimationFrame(() => {
			if (isZoomed) {
				zoomContainer.classList.add(ZOOMED_OUT_CLASS);
				zoomContainer.style.setProperty(ZOOM_CSS_VAR, scale.toString());
				// Apply transform with !important to override any conflicting styles
				zoomContainer.style.setProperty(
					'transform',
					`scale(${scale})`,
					'important'
				);
				zoomContainer.style.setProperty(
					'transform-origin',
					'top center',
					'important'
				);
			} else {
				zoomContainer.classList.remove(ZOOMED_OUT_CLASS);
				zoomContainer.style.removeProperty(ZOOM_CSS_VAR);
				zoomContainer.style.removeProperty('transform');
				zoomContainer.style.removeProperty('transform-origin');
			}
		});
	}, []);

	// Iframe keydown: Escape closes overlay (parent document does not see keys when focus is in iframe),
	// then Blockera zoom shortcuts, then Cmd/Ctrl+R reload (must run after applyPreviewZoom exists).
	useEffect(() => {
		iframeKeydownDispatchRef.current = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') {
				event.preventDefault();
				event.stopPropagation();
				handleClose();
				return;
			}

			const zoomHandled = handleZoomKeyboardEvent(event, {
				getZoomPercent: () => zoomPercentRef.current,
				onZoomChange: (next): void => {
					saveZoomToStorage(next);
					setZoomPercent(next);
					applyPreviewZoom(next);
					window.dispatchEvent(
						new CustomEvent('blockera-editor-zoom-sync', {
							detail: { zoom: next },
						})
					);
				},
				onZoomToFit: (): void => {
					window.dispatchEvent(
						new CustomEvent('blockera-editor-zoom-to-fit-request')
					);
				},
			});
			if (zoomHandled) {
				return;
			}

			const isReloadShortcut =
				event.key === 'r' && (event.metaKey || event.ctrlKey);
			if (isReloadShortcut) {
				event.preventDefault();
				event.stopPropagation();
				handleReload();
			}
		};
	}, [applyPreviewZoom, handleClose, handleReload]);

	// Keep zoom ref in sync with state
	useEffect(() => {
		zoomPercentRef.current = zoomPercent;
	}, [zoomPercent]);

	// Detect when opening animation completes and remove is-opening class
	useEffect(() => {
		if (!isOpening) {
			return;
		}

		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		let rafId: number | null = null;
		let animationContainer: HTMLDivElement | null = null;
		let handleAnimationEnd: ((event: AnimationEvent) => void) | null = null;

		// Wait for container to be available
		const checkContainer = (): void => {
			animationContainer = containerRef.current;
			if (!animationContainer) {
				// Container not ready yet, try again on next frame
				rafId = requestAnimationFrame(checkContainer);
				return;
			}

			// Listen for animation end event to detect when opening animation completes
			handleAnimationEnd = (event: AnimationEvent): void => {
				// Check if this is the opening animation (case-insensitive check)
				const animationName = event.animationName?.toLowerCase() || '';
				if (
					animationName.includes('blockera-preview-slide-up') ||
					animationName.includes('slide-up')
				) {
					if (!isClosing) {
						setIsOpening(false);
					}
				}
			};

			// Fallback timeout in case animation event doesn't fire
			const animationDuration = 200; // Match CSS var(--animation-duration)
			timeoutId = setTimeout(() => {
				if (!isClosing) {
					setIsOpening(false);
				}
			}, animationDuration + 100); // Add buffer for safety

			animationContainer.addEventListener(
				'animationend',
				handleAnimationEnd
			);
			// Also listen for webkitAnimationEnd for Safari compatibility
			animationContainer.addEventListener(
				'webkitAnimationEnd',
				handleAnimationEnd as EventListener
			);
		};

		checkContainer();

		return () => {
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
			}
			if (animationContainer && handleAnimationEnd) {
				animationContainer.removeEventListener(
					'animationend',
					handleAnimationEnd
				);
				animationContainer.removeEventListener(
					'webkitAnimationEnd',
					handleAnimationEnd as EventListener
				);
			}
		};
	}, [isOpening, isClosing]);

	// Reset opening state when closing starts
	useEffect(() => {
		if (isClosing) {
			setIsOpening(false);
		}
	}, [isClosing]);

	// Set initial iframe height as soon as container is ready (before iframe loads)
	// This prevents the iframe from appearing small during loading
	useEffect(() => {
		const iframe = iframeRef.current;
		const heightContainer = containerRef.current;

		if (!iframe || !heightContainer || previewHeightRef.current !== null) {
			// Already set or elements not ready
			return;
		}

		// Calculate initial height based on viewport (container may be small during opening animation)
		// Use requestAnimationFrame to ensure DOM is ready
		requestAnimationFrame(() => {
			// Use viewport height instead of container height because container is still animating/small
			// Container height will be small (e.g., 200px) during opening animation
			const viewportHeight = window.innerHeight;
			const headerHeight = 26; // --header-height CSS variable
			const overlayTop = 64; // top: 64px from CSS
			const overlayPadding = 80; // 40px top + 40px bottom
			const containerPadding = 16; // 8px top + 8px bottom (inside container)
			const availableHeight =
				viewportHeight -
				overlayTop -
				overlayPadding -
				headerHeight -
				containerPadding;

			if (availableHeight > 0) {
				// Set initial height to fill available viewport space immediately
				// This will be overridden when actual content height arrives
				iframe.style.setProperty(
					'height',
					`${availableHeight}px`,
					'important'
				);
				iframe.style.setProperty('overflow', 'hidden', 'important');
				iframe.setAttribute('scrolling', 'no');
				previewHeightRef.current = availableHeight;
				setPreviewIframeHeight(availableHeight);
			}
		});
	}, [container, isOpening]); // Run when container is set or opening animation completes

	// Listen for height messages from preview iframe
	useEffect(() => {
		window.addEventListener('message', handlePreviewHeightMessage);

		return () => {
			window.removeEventListener('message', handlePreviewHeightMessage);
			// Clear any pending debounced updates
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, [handlePreviewHeightMessage]);

	// Sync zoom state when overlay opens and listen for zoom changes
	useEffect(() => {
		// Load current zoom from storage when overlay opens
		const currentZoom = loadZoomFromStorage();
		setZoomPercent(currentZoom);
		applyPreviewZoom(currentZoom);

		// Listen for storage changes to sync zoom updates from other tabs/windows
		const handleStorageChange = (event: StorageEvent): void => {
			// Check if zoom storage key changed
			if (event.key === 'blockeraEditorZoomPercent' && event.newValue) {
				const newZoom = parseInt(event.newValue, 10);
				if (!isNaN(newZoom) && newZoom >= 10 && newZoom <= 200) {
					setZoomPercent(newZoom);
					applyPreviewZoom(newZoom);
				}
			}
		};

		// Poll for zoom changes in same window (storage event only fires for other tabs)
		// Use requestAnimationFrame for near-instant sync (runs at ~60fps, ~16ms intervals)
		let rafId: number | null = null;
		const pollZoom = (): void => {
			const storedZoom = loadZoomFromStorage();
			// Use ref to avoid stale closure
			if (storedZoom !== zoomPercentRef.current) {
				setZoomPercent(storedZoom);
				applyPreviewZoom(storedZoom);
			}
			rafId = requestAnimationFrame(pollZoom);
		};
		rafId = requestAnimationFrame(pollZoom);

		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}
		};
	}, [applyPreviewZoom]);

	// Handle iframe load completion
	const handleIframeLoadComplete = useCallback((): void => {
		// Set initial height to fill container while waiting for actual content height
		// Only set if not already set by the early useEffect
		const iframe = iframeRef.current;
		const loadContainer = containerRef.current;
		if (iframe && loadContainer && previewHeightRef.current === null) {
			// Calculate available height in container (container height minus header and padding)
			const containerRect = loadContainer.getBoundingClientRect();
			const headerHeight = 26; // --header-height CSS variable
			const containerPadding = 16; // 8px top + 8px bottom
			const availableHeight =
				containerRect.height - headerHeight - containerPadding;

			if (availableHeight > 0) {
				// Set initial height to fill available space
				// This will be overridden when actual content height arrives
				iframe.style.setProperty(
					'height',
					`${availableHeight}px`,
					'important'
				);
				iframe.style.setProperty('overflow', 'hidden', 'important');
				iframe.setAttribute('scrolling', 'no');
				previewHeightRef.current = availableHeight;
				setPreviewIframeHeight(availableHeight);
			}
		}

		// Complete progress to 100%
		setLoadProgress(100);

		// Brief delay to show 100% before hiding loading state
		setTimeout(() => {
			setIsLoading(false);
		}, 150);

		// Only set up graceful animation stop if we're actually spinning
		// This prevents issues on initial load when no animation is running
		if (isSpinningRef.current) {
			// Get the SVG element inside the reload button to listen for animation iteration
			const svgElement = reloadBtnRef.current?.querySelector('svg');
			if (svgElement) {
				const handleAnimationIteration = (): void => {
					// Animation completed a full cycle (back to 0deg), now stop
					isSpinningRef.current = false;
					setIsReloading(false);
					svgElement.removeEventListener(
						'animationiteration',
						handleAnimationIteration
					);
				};
				svgElement.addEventListener(
					'animationiteration',
					handleAnimationIteration
				);
			} else {
				// Fallback: if we can't find SVG, just stop immediately
				isSpinningRef.current = false;
				setIsReloading(false);
			}
		}

		// Apply zoom to iframe after it loads
		applyPreviewZoom(zoomPercent);

		// Setup iframe event handlers
		setupIframeHandlers();
	}, [setupIframeHandlers, applyPreviewZoom, zoomPercent]);

	// Block navigation inside iframe when it loads
	const handleIframeLoad = useCallback((): void => {
		handleIframeLoadComplete();
	}, [handleIframeLoadComplete]);

	// Memoized computed values for performance
	const {
		iframeClassName,
		iframeContainerStyles,
		overlayClassName,
		containerClassName,
	} = useMemo(() => {
		// Iframe class name
		const iframeClasses = [
			'blockera-preview-overlay__iframe',
			`breakpoint-${breakpointType}`,
			isLoading
				? 'blockera-preview-overlay__iframe--loading'
				: 'blockera-preview-overlay__iframe--loaded',
		];

		// Iframe container styles
		const containerStyles: CSSProperties = { width: maxWidth };

		// Overlay class name
		const overlayClasses = ['blockera-preview-overlay'];
		if (isClosing) {
			overlayClasses.push('is-closing');
		}

		// Container class name
		const containerClasses = [
			'blockera-preview-overlay__iframe-container',
			`breakpoint-${breakpointType}`,
			// Add breakpoint-small class if maxWidth is not 100% and less than 500px
			maxWidth !== '100%' && parseInt(maxWidth, 10) < 500
				? 'breakpoint-small'
				: '',
		];

		if (isOpening) {
			containerClasses.push('is-opening');
		}

		if (isClosing) {
			containerClasses.push('is-closing');
		}

		return {
			iframeClassName: iframeClasses.join(' '),
			iframeContainerStyles: containerStyles,
			overlayClassName: overlayClasses.join(' '),
			containerClassName: containerClasses.join(' '),
		};
	}, [breakpointType, isLoading, maxWidth, isClosing, isOpening]);

	// Don't render if container is not available
	if (!container) {
		return null;
	}

	return createPortal(
		<div
			className={overlayClassName}
			role="dialog"
			aria-modal="true"
			aria-label={__('Preview', 'blockera')}
		>
			{/* Iframe container with dynamic breakpoint sizing */}
			<div
				ref={containerRef}
				className={containerClassName}
				style={iframeContainerStyles}
			>
				{/* Header bar with URL info and action buttons */}
				<PreviewHeader
					className={`blockera-preview-overlay__header ${
						breakpointType === 'small' ? 'breakpoint-small' : ''
					}`}
					content={
						<>
							<div className="blockera-canvas-header__url-bar">
								{/* Lock icon: green for https, red for http */}
								<span
									className={`blockera-preview-overlay__lock-icon ${
										isSecure ? 'is-secure' : 'is-insecure'
									}`}
								>
									<Icon
										icon={isSecure ? 'lock' : 'unlock'}
										iconLibrary="wp"
									/>
								</span>

								{/* URL display with ellipsis overflow */}
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									className="blockera-preview-overlay__url"
									data-protocol={isSecure ? 'https' : 'http'}
									dangerouslySetInnerHTML={{
										__html: processedUrl,
									}}
								/>

								{/* External link button to open URL in new tab */}
								<Button
									icon={<Icon icon="link" iconLibrary="wp" />}
									className="blockera-preview-overlay__external-link"
									onClick={handleOpenInNewTab}
									aria-label={__(
										'Open in new tab',
										'blockera'
									)}
									showTooltip={true}
									noBorder={true}
								/>
							</div>
						</>
					}
					start={
						<>
							<Button
								ref={reloadBtnRef}
								icon={reloadIcon}
								onClick={handleReload}
								className={classNames(
									'blockera-preview-overlay__action-btn',
									'action-btn-reload',
									isReloading ? ' is-spinning' : ''
								)}
								aria-label={__('Reload preview', 'blockera')}
								showTooltip={true}
								size="small"
								noBorder={true}
							/>
						</>
					}
					onClose={handleClose}
				/>

				<div
					className={`blockera-preview-overlay__loading ${
						isLoading ? 'is-loading' : 'is-loaded'
					}`}
				>
					{isLoading && <ProgressBar value={loadProgress} />}
				</div>

				<iframe
					ref={(el) => {
						if (el && !iframeRef.current) {
							// Set initial height immediately when iframe is mounted
							// Use viewport height since container may be small during opening animation
							if (previewHeightRef.current === null) {
								const viewportHeight = window.innerHeight;
								const headerHeight = 26;
								const overlayTop = 64;
								const overlayPadding = 80;
								const containerPadding = 16;
								const availableHeight =
									viewportHeight -
									overlayTop -
									overlayPadding -
									headerHeight -
									containerPadding;

								if (availableHeight > 0) {
									el.style.setProperty(
										'height',
										`${availableHeight}px`,
										'important'
									);
									el.style.setProperty(
										'overflow',
										'hidden',
										'important'
									);
									el.setAttribute('scrolling', 'no');
									previewHeightRef.current = availableHeight;
									setPreviewIframeHeight(availableHeight);
								}
							}
						}
						iframeRef.current = el;
					}}
					src={iframeUrl}
					title={__('Preview', 'blockera')}
					className={iframeClassName}
					onLoad={handleIframeLoad}
					style={
						previewIframeHeight
							? {
									height: `${previewIframeHeight}px`,
									overflow: 'hidden',
								}
							: undefined
					}
				/>
			</div>
		</div>,
		container
	);
}
