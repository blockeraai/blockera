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
		onInitializationWithdrawn?: (
			instance: OverlayScrollbarsComponent
		) => void;
		onDestroyed?: (instance: OverlayScrollbarsComponent) => void;
		onScrollStart?: (
			instance: OverlayScrollbarsComponent,
			event: Event
		) => void;
		onScroll?: (instance: OverlayScrollbarsComponent, event: Event) => void;
		onScrollStop?: (
			instance: OverlayScrollbarsComponent,
			event: Event
		) => void;
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
 * @return The OverlayScrollbars instance, or null if not initialized
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
	const observersCleanupRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) {
			return;
		}

		let cancelled = false;

		const initialize = async (): Promise<void> => {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const overlayScrollbarsModule =
					await import('overlayscrollbars');
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
				const OverlayScrollbarsClass =
					overlayScrollbarsModule.OverlayScrollbars as any;

				if (
					cancelled ||
					ref.current !== element ||
					!OverlayScrollbarsClass ||
					instanceRef.current
				) {
					return;
				}

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

				const updateScrollbar = (): void => {
					try {
						instance.update();
					} catch {
						// Ignore update errors
					}
				};

				requestAnimationFrame(() => {
					updateScrollbar();
					setTimeout(() => {
						updateScrollbar();
						setTimeout(updateScrollbar, 50);
					}, 100);
				});

				// Attach after async init — a separate effect never saw instanceRef (was always null).
				const resizeObserver = new ResizeObserver(() => {
					requestAnimationFrame(() => {
						updateScrollbar();
					});
				});
				const mutationObserver = new MutationObserver(() => {
					requestAnimationFrame(() => {
						updateScrollbar();
					});
				});

				resizeObserver.observe(element);
				mutationObserver.observe(element, {
					childList: true,
					subtree: true,
				});

				try {
					const elements = instance.elements();
					if (elements.content) {
						resizeObserver.observe(elements.content);
						mutationObserver.observe(elements.content, {
							childList: true,
							subtree: true,
						});
					}
				} catch {
					// Ignore if elements() is not available
				}

				observersCleanupRef.current = () => {
					resizeObserver.disconnect();
					mutationObserver.disconnect();
				};
			} catch {
				// Silently fail - package is optional
			}
		};

		void initialize();

		return () => {
			cancelled = true;
			observersCleanupRef.current?.();
			observersCleanupRef.current = null;
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

	return instanceRef.current;
}
