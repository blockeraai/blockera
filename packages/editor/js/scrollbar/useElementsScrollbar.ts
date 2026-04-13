/**
 * WordPress dependencies
 */
import { useEffect, useRef, useMemo } from '@wordpress/element';
import type { OverlayScrollbarsOptions } from './useScrollbar';

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
 * Configuration for block editor scrollbar targets.
 */
export type BlockEditorScrollbarTarget = {
	/** CSS selector to find the element */
	selector: string;
	/** OverlayScrollbars options for this target */
	options?: OverlayScrollbarsOptions;
	/** Whether to observe for new elements matching the selector */
	observe?: boolean;
};

/**
 * Hook to apply OverlayScrollbars to elements that we don't own.
 *
 * Uses MutationObserver to find and initialize scrollbars on elements that are
 * created and managed externally. This is necessary because these elements
 * may be created/destroyed dynamically.
 *
 * @param targets - Array of target configurations specifying selectors and options
 * @param enabled - Whether the hook is enabled (default: true)
 *
 * @example
 * ```tsx
 * useElementsScrollbar([
 *   {
 *     selector: '.editor-list-view-sidebar__list-view-panel-content',
 *     options: { scrollbars: { autoHide: 'move' } }
 *   },
 *   {
 *     selector: '.editor-list-view-sidebar__list-view-container',
 *     options: { scrollbars: { autoHide: 'move' } }
 *   }
 * ]);
 * ```
 */
export function useElementsScrollbar(
	targets: BlockEditorScrollbarTarget[],
	enabled: boolean = true
): void {
	const instancesRef = useRef<Map<Element, OverlayScrollbarsComponent>>(
		new Map()
	);
	const observerRef = useRef<MutationObserver | null>(null);
	const initializedElementsRef = useRef<WeakSet<Element>>(new WeakSet());
	const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);
	const rafRef = useRef<number | null>(null);
	const libraryPromiseRef = useRef<Promise<
		typeof import('overlayscrollbars')
	> | null>(null);

	// Memoize targets key more efficiently - only stringify selectors
	const targetsKey = useMemo(() => {
		// Create a simple string key from selectors for faster comparison
		return targets.map((t) => t.selector).join('|');
	}, [targets]);

	useEffect(() => {
		if (!enabled || targets.length === 0) {
			return;
		}

		const instances = instancesRef.current;
		const initializedElements = initializedElementsRef.current;
		let OverlayScrollbarsClass:
			| ((
					element:
						| HTMLElement
						| {
								target: HTMLElement;
								elements: { viewport: HTMLElement };
						  },
					options?: unknown
			  ) => OverlayScrollbarsComponent)
			| null = null;

		/**
		 * Lazy load OverlayScrollbars library with caching.
		 * Reuses the same promise to avoid multiple concurrent imports.
		 */
		const loadLibrary = async (): Promise<
			typeof OverlayScrollbarsClass
		> => {
			if (!libraryPromiseRef.current) {
				libraryPromiseRef.current = import('overlayscrollbars');
			}
			const overlayScrollbarsModule = await libraryPromiseRef.current;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
			return overlayScrollbarsModule.OverlayScrollbars as any;
		};

		/**
		 * Initialize OverlayScrollbars on an element if not already initialized.
		 * Optimized with early returns and cached library loading.
		 */
		const initializeElement = async (
			element: Element,
			options?: OverlayScrollbarsOptions
		): Promise<void> => {
			// Early return if already initialized or not an HTMLElement
			if (
				initializedElements.has(element) ||
				!(element instanceof HTMLElement)
			) {
				return;
			}

			// Early return if already has an instance
			if (instances.has(element)) {
				return;
			}

			try {
				// Load library if not already loaded (cached per effect)
				if (!OverlayScrollbarsClass) {
					OverlayScrollbarsClass = await loadLibrary();
				}

				// Double-check element still exists and is valid
				if (!element.isConnected || !OverlayScrollbarsClass) {
					return;
				}

				// Merge options with defaults efficiently
				const mergedOptions: OverlayScrollbarsOptions = {
					...options,
					overflow: {
						x: options?.overflow?.x ?? 'scroll',
						y: options?.overflow?.y ?? 'scroll',
						...(options?.overflow || {}),
					},
				};

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
					mergedOptions
				);

				instances.set(element, instance);
				initializedElements.add(element);
			} catch {
				// Silently fail - package is optional
			}
		};

		/**
		 * Process all targets and initialize matching elements.
		 * Uses requestAnimationFrame to batch DOM reads for better performance.
		 */
		const processTargets = (): void => {
			// Cancel any pending RAF
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}

			// Batch DOM reads in requestAnimationFrame
			rafRef.current = requestAnimationFrame(() => {
				rafRef.current = null;

				// Process all targets in a single batch
				const elementsToInit: Array<{
					element: Element;
					options?: OverlayScrollbarsOptions;
				}> = [];

				for (const target of targets) {
					// Skip if target has observe: false (though currently not used)
					if (target.observe === false) {
						continue;
					}

					try {
						const elements = document.querySelectorAll(
							target.selector
						);
						for (const element of elements) {
							// Only add if not already initialized
							if (!initializedElements.has(element)) {
								elementsToInit.push({
									element,
									options: target.options,
								});
							}
						}
					} catch {
						// Ignore invalid selectors
					}
				}

				// Initialize all found elements (async, but non-blocking)
				if (elementsToInit.length > 0) {
					void Promise.all(
						elementsToInit.map(({ element, options }) =>
							initializeElement(element, options)
						)
					);
				}
			});
		};

		/**
		 * Clean up instances for removed elements.
		 * Optimized to avoid expensive querySelectorAll('*') calls.
		 */
		const cleanupRemovedElements = (removedNodes: NodeList): void => {
			// Use a Set for O(1) lookups instead of array iteration
			const nodesToCheck = new Set<Element>();

			for (const node of Array.from(removedNodes)) {
				if (!(node instanceof Element)) {
					continue;
				}

				// Check the node itself
				if (instances.has(node)) {
					nodesToCheck.add(node);
				}

				// Only check direct children, not all descendants (performance optimization)
				// This is safe because if a parent is removed, children are also removed
				for (const child of Array.from(node.children)) {
					if (instances.has(child)) {
						nodesToCheck.add(child);
					}
				}
			}

			// Clean up found instances
			for (const checkNode of nodesToCheck) {
				const instance = instances.get(checkNode);
				if (instance) {
					try {
						instance.destroy();
					} catch {
						// Ignore destroy errors
					}
					instances.delete(checkNode);
					initializedElements.delete(checkNode);
				}
			}
		};

		// Initial processing after a short delay to ensure DOM is ready
		// Use requestIdleCallback if available, otherwise setTimeout
		const initialDelay =
			typeof requestIdleCallback !== 'undefined'
				? requestIdleCallback
				: (callback: () => void) => setTimeout(callback, 0);

		initialDelay(() => {
			processTargets();
		});

		// Set up MutationObserver with optimized configuration
		observerRef.current = new MutationObserver((mutations) => {
			let hasAdditions = false;

			// Process removals first (synchronous, fast)
			for (const mutation of mutations) {
				if (mutation.removedNodes.length > 0) {
					cleanupRemovedElements(mutation.removedNodes);
				}
				// Check for additions (new elements that might match our selectors)
				if (mutation.addedNodes.length > 0) {
					hasAdditions = true;
				}
			}

			// Only process targets if there were additions
			// Removals are handled synchronously above, no need to re-query
			if (hasAdditions) {
				// Debounce processing to avoid excessive initialization
				if (debounceTimeoutRef.current) {
					clearTimeout(debounceTimeoutRef.current);
				}
				debounceTimeoutRef.current = setTimeout(() => {
					processTargets();
					debounceTimeoutRef.current = null;
				}, 150); // Slightly longer debounce for better performance
			}
		});

		// Observe the document body for new elements
		// Using subtree: true is necessary but we optimize the callback
		if (document.body) {
			observerRef.current.observe(document.body, {
				childList: true,
				subtree: true,
				// Don't observe attributes/characterData - we only care about structure changes
			});
		}

		// Cleanup function
		return () => {
			// Cancel pending operations
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}

			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
				debounceTimeoutRef.current = null;
			}

			// Clean up all instances
			instances.forEach((instance) => {
				try {
					instance.destroy();
				} catch {
					// Ignore cleanup errors
				}
			});
			instances.clear();
			initializedElementsRef.current = new WeakSet(); // Reset WeakSet
			observerRef.current?.disconnect();
			observerRef.current = null;
			libraryPromiseRef.current = null; // Reset library cache
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enabled, targetsKey]);
}
