/**
 * WordPress dependencies
 */
import {
	useLayoutEffect,
	useEffect,
	useRef,
	type RefObject,
} from '@wordpress/element';

// Module-level cache so re-mounts skip the async import entirely
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedOSClass: any = null;

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
 * Uses useLayoutEffect with a module-level cache so that on component
 * re-mounts (e.g. portal container changes) the instance is created
 * synchronously before the browser paints, eliminating visual flashes.
 * The first mount uses an async import that resolves after paint.
 *
 * Temporarily hides overflow-toggled siblings during measurement to
 * break CSS feedback loops where sibling width affects overflow detection.
 *
 * @param ref - React ref to the element that should have custom scrollbars
 * @param options - OverlayScrollbars configuration options
 * @param deps - Optional dependency array to trigger scrollbar recalculation when content changes
 * @return The OverlayScrollbars instance, or null if not initialized
 */
export function useScrollbar<T extends HTMLElement>(
	ref: RefObject<T>,
	options?: OverlayScrollbarsOptions,
	deps?: React.DependencyList
): OverlayScrollbarsComponent | null {
	const instanceRef = useRef<OverlayScrollbarsComponent | null>(null);
	const observersCleanupRef = useRef<(() => void) | null>(null);
	const updateScrollbarRef = useRef<(() => void) | null>(null);

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) {
			return;
		}

		let cancelled = false;
		let lastOverflowX: 'hidden' | 'scroll' | null = null;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const setup = (OSClass: any): void => {
			if (cancelled || ref.current !== element || instanceRef.current) {
				return;
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const instance = OSClass(
				{
					target: element,
					elements: { viewport: element },
				} as any,
				options || {}
			);

			instanceRef.current = instance;
			const wrapper = element.closest('.blockera-tabs-wrapper');

			const updateScrollbar = (): void => {
				try {
					const tabsContent = element.querySelector(
						'.blockera-tabs-bar-tabs'
					) as HTMLElement | null;
					const hasTabsOverflow = tabsContent
						? tabsContent.scrollWidth > tabsContent.clientWidth
						: element.scrollWidth > element.clientWidth;
					const overflowX: 'hidden' | 'scroll' = hasTabsOverflow
						? 'scroll'
						: 'hidden';

					if (overflowX !== lastOverflowX) {
						instance.options({
							overflow: {
								x: overflowX,
								y: 'hidden',
							},
						});
						lastOverflowX = overflowX;
					}
					instance.update(true);

					if (wrapper) {
						wrapper.classList.toggle(
							'blockera-tabs-has-overflow',
							hasTabsOverflow
						);
					}

					const maxScroll = element.scrollWidth - element.clientWidth;
					if (element.scrollLeft > maxScroll) {
						element.scrollLeft = Math.max(0, maxScroll);
					}
				} catch {
					// Ignore update errors
				}
			};
			updateScrollbarRef.current = updateScrollbar;

			requestAnimationFrame(() => {
				updateScrollbar();
				requestAnimationFrame(() => {
					updateScrollbar();
				});
			});

			const resizeObserver = new ResizeObserver(() => {
				requestAnimationFrame(() => {
					updateScrollbar();
				});
			});

			const mutationObserver = new MutationObserver(() => {
				requestAnimationFrame(() => {
					updateScrollbar();
					requestAnimationFrame(() => {
						updateScrollbar();
					});
				});
			});

			resizeObserver.observe(element);
			mutationObserver.observe(element, {
				childList: true,
				subtree: true,
			});

			try {
				const els = instance.elements();
				if (els.content) {
					resizeObserver.observe(els.content);
					mutationObserver.observe(els.content, {
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
		};

		if (cachedOSClass) {
			setup(cachedOSClass);
		} else {
			const initAsync = async (): Promise<void> => {
				try {
					const mod = await import('overlayscrollbars');
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
					cachedOSClass = mod.OverlayScrollbars as any;
					setup(cachedOSClass);
				} catch {
					// Silently fail — package is optional
				}
			};
			void initAsync();
		}

		return () => {
			cancelled = true;
			observersCleanupRef.current?.();
			observersCleanupRef.current = null;
			updateScrollbarRef.current = null;
			ref.current
				?.closest('.blockera-tabs-wrapper')
				?.classList.remove('blockera-tabs-has-overflow');
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
		if ((instanceRef.current || updateScrollbarRef.current) && deps) {
			requestAnimationFrame(() => {
				try {
					if (updateScrollbarRef.current) {
						updateScrollbarRef.current();
					} else {
						instanceRef.current?.update(true);
					}
				} catch {
					// Ignore update errors
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return instanceRef.current;
}
