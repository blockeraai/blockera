/**
 * WordPress dependencies
 */
import { useEffect, useRef, type RefObject } from '@wordpress/element';

/**
 * OverlayScrollbars instance type.
 * Defined locally to avoid requiring the package at build time.
 */
type OverlayScrollbarsComponent = {
	destroy: () => void;
	update: (options?: unknown) => void;
	scroll: (position: { x?: number; y?: number }) => void;
	elements: () => {
		viewport: HTMLElement;
		content: HTMLElement;
		scrollbarHorizontal: HTMLElement;
		scrollbarVertical: HTMLElement;
	};
	options: (options?: unknown) => unknown;
	state: () => unknown;
	plugin: (plugin: unknown) => unknown;
};

/**
 * Configuration options for OverlayScrollbars.
 * Matches the library's options interface.
 */
export type OverlayScrollbarsOptions = {
	scrollbars?: {
		theme?: string;
		visibility?: 'auto' | 'visible' | 'hidden';
		autoHide?: 'never' | 'scroll' | 'leave' | 'move';
		autoHideDelay?: number;
		dragScrolling?: boolean;
		clickScrolling?: boolean;
		touchSupport?: boolean;
		snapHandle?: boolean;
	};
	overflow?: {
		x?: 'hidden' | 'scroll' | 'visible' | 'auto';
		y?: 'hidden' | 'scroll' | 'visible' | 'auto';
	};
	showNativeOverlaidScrollbars?: boolean;
	update?: {
		debounce?: number | number[];
		attributes?: string | string[];
		ignoreInitialization?: boolean;
	};
	textarea?: {
		dynWidth?: boolean;
		dynHeight?: boolean;
		inheritedAttrs?: string | string[] | null;
	};
	callbacks?: {
		onInitialized?: (instance: OverlayScrollbarsComponent) => void;
		onInitializationWithdrawn?: (instance: OverlayScrollbarsComponent) => void;
		onDestroyed?: (instance: OverlayScrollbarsComponent) => void;
		onScrollStart?: (instance: OverlayScrollbarsComponent, event: Event) => void;
		onScroll?: (instance: OverlayScrollbarsComponent, event: Event) => void;
		onScrollStop?: (instance: OverlayScrollbarsComponent, event: Event) => void;
		onUpdated?: (instance: OverlayScrollbarsComponent) => void;
	};
};

/**
 * Hook to apply OverlayScrollbars to a React element ref.
 *
 * Automatically initializes OverlayScrollbars when the element is mounted
 * and cleans up when unmounted. The instance is returned for programmatic control.
 *
 * @param ref - React ref to the element that should have custom scrollbars
 * @param options - OverlayScrollbars configuration options
 * @param deps - Optional dependency array to trigger scrollbar recalculation when content changes
 * @returns The OverlayScrollbars instance, or null if not initialized
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const osInstance = useScrollbar(containerRef, {
 *   scrollbars: {
 *     theme: 'os-theme-dark',
 *     autoHide: 'move'
 *   }
 * }, [tabs.length]); // Recalculate when tabs change
 * ```
 */
export function useScrollbar<T extends HTMLElement>(
	ref: RefObject<T>,
	options?: OverlayScrollbarsOptions,
	deps?: React.DependencyList
): OverlayScrollbarsComponent | null {
	const instanceRef = useRef<OverlayScrollbarsComponent | null>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) {
			return;
		}

		// Dynamically import OverlayScrollbars to avoid SSR issues
		// and to ensure it's only loaded when needed
		let OverlayScrollbarsClass: ((element: HTMLElement, options?: unknown) => OverlayScrollbarsComponent) | null = null;

		const initialize = async (): Promise<void> => {
			try {
				// Import the library dynamically
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const overlayScrollbarsModule = await import('overlayscrollbars');
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
				OverlayScrollbarsClass = overlayScrollbarsModule.OverlayScrollbars as any;

				// Initialize if element still exists and not already initialized
				if (element && OverlayScrollbarsClass && !instanceRef.current) {
					// Use viewport option to prevent OverlayScrollbars from wrapping the element
					// This avoids React DOM conflicts since the element structure remains unchanged
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const instance = OverlayScrollbarsClass(
						{
							target: element,
							elements: {
								viewport: element,
							},
						} as any,
						options || {}
					);

					instanceRef.current = instance;

					// Force multiple updates after initialization to ensure scrollbar size is correct
					// React may not have finished rendering children yet, so we update after delays
					// This is especially important for horizontal scrolling where content width changes
					const updateScrollbar = (): void => {
						try {
							instance.update();
						} catch {
							// Ignore update errors
						}
					};

					// Update immediately after current frame
					requestAnimationFrame(() => {
						updateScrollbar();
						// Update again after a short delay to catch any delayed renders
						setTimeout(() => {
							updateScrollbar();
							// One more update after content has fully settled
							setTimeout(updateScrollbar, 50);
						}, 100);
					});
				}
			} catch {
				// Silently fail - package is optional
				// All import errors are silently ignored
			}
		};

		initialize();

		// Cleanup function
		return () => {
			if (instanceRef.current) {
				try {
					instanceRef.current.destroy();
				} catch {
					// Ignore cleanup errors
				}
				instanceRef.current = null;
			}
		};
	}, [ref, options]);

	// Update scrollbar when content changes (deps change)
	useEffect(() => {
		if (instanceRef.current && deps) {
			// Use requestAnimationFrame to ensure DOM has updated
			requestAnimationFrame(() => {
				try {
					instanceRef.current?.update();
				} catch {
					// Ignore update errors
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	// Use ResizeObserver and MutationObserver to automatically update scrollbar when content changes
	useEffect(() => {
		const element = ref.current;
		const instance = instanceRef.current;
		if (!element || !instance) {
			return;
		}

		// Create ResizeObserver to watch for content size changes
		const resizeObserver = new ResizeObserver(() => {
			// Debounce updates to avoid excessive recalculations
			requestAnimationFrame(() => {
				try {
					instance.update();
				} catch {
					// Ignore update errors
				}
			});
		});

		// Create MutationObserver to watch for DOM changes (tabs added/removed)
		const mutationObserver = new MutationObserver(() => {
			// Update scrollbar when content structure changes
			requestAnimationFrame(() => {
				try {
					instance.update();
				} catch {
					// Ignore update errors
				}
			});
		});

		// Observe the element for size changes
		resizeObserver.observe(element);

		// Observe the element for DOM changes (childList changes)
		mutationObserver.observe(element, {
			childList: true,
			subtree: false, // Only watch direct children for performance
		});

		// Also observe the content element if available (for horizontal scroll, content width changes)
		try {
			const elements = instance.elements();
			if (elements.content) {
				resizeObserver.observe(elements.content);
				// Also watch content for DOM changes
				mutationObserver.observe(elements.content, {
					childList: true,
					subtree: false,
				});
			}
		} catch {
			// Ignore if elements() is not available
		}

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, [ref]);

	return instanceRef.current;
}
