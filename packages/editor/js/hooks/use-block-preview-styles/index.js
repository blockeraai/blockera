// @flow

/**
 * External dependencies
 */
import {
	useState,
	useRef,
	useMemo,
	useLayoutEffect,
	createRoot,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { omitWithPattern } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { sanitizeBlockAttributes } from '../../extensions/hooks/utils';
import { GlobalStylesRenderer } from '../../extensions/components/global-styles-renderer';

/**
 * Generates a stable ID for block preview styles based on block name and variation.
 * Replaces Math.random() to prevent unnecessary recalculations.
 */
const generateStableId = (blockName: string, variation: string): string => {
	const base = blockName.replace('/', '-');
	return variation ? `${base}-${variation}` : base;
};

/**
 * Extracts CSS text from rendered style elements within a container.
 * Queries style elements directly instead of using MutationObserver.
 */
const extractStylesFromContainer = (container: HTMLElement): string => {
	const styleElements = container.querySelectorAll('style');
	const styles: string[] = [];

	for (let i = 0; i < styleElements.length; i++) {
		const styleEl = styleElements[i];
		if (styleEl.textContent) {
			styles.push(styleEl.textContent);
		}
	}

	return styles.join('\n');
};

export const useBlockPreviewStyles = (
	blockType: Object,
	variation: string,
	styles: Object = {},
	variationClassPrefix: string = 'is-style-'
): string => {
	const [additionalStyles, setAdditionalStyles] = useState('');

	// Stable container ID per hook instance
	const containerIdRef = useRef<string | null>(null);
	const containerRef = useRef<HTMLElement | null>(null);
	const rootRef = useRef<any | null>(null);
	const isMountedRef = useRef<boolean>(true);
	const timeoutRef = useRef<TimeoutID | null>(null);

	// Initialize container ID once
	if (!containerIdRef.current) {
		containerIdRef.current = `blockera-global-styles-preview-${generateStableId(
			blockType?.name || '',
			variation
		)}`;
	}

	// Memoize omitted styles to prevent unnecessary recalculations
	const validBlockGlobalStyles = useMemo(
		() => omitWithPattern(styles, /^(?!blockera).*/i),
		[styles]
	);

	// Memoize stable ID to prevent recalculation
	const stableId = useMemo(
		() => generateStableId(blockType?.name || '', variation),
		[blockType?.name, variation]
	);

	// Memoize sanitizedBlockGlobalStyles with stable ID
	const sanitizedBlockGlobalStyles = useMemo(() => {
		const blockStatesValue =
			validBlockGlobalStyles?.blockeraBlockStates?.value || {};

		return sanitizeBlockAttributes({
			...validBlockGlobalStyles,
			blockeraBlockStates: {
				value: {
					...blockStatesValue,
					normal: {
						breakpoints: {},
						isVisible: true,
					},
				},
			},
			blockeraPropsId: stableId,
		});
	}, [validBlockGlobalStyles, stableId]);

	// Track last extracted styles to prevent unnecessary state updates
	const lastStylesRef = useRef<string>('');

	// Memoize block type name to prevent unnecessary re-renders
	const blockTypeName = blockType?.name;

	// Use useLayoutEffect for synchronous DOM updates
	useLayoutEffect(() => {
		isMountedRef.current = true;

		// Get or create container element (reuse across renders)
		let container = containerRef.current;

		if (!container) {
			// Check for existing container from previous instance
			const existing = document.getElementById(
				containerIdRef.current || ''
			);
			if (existing) {
				container = existing;
			} else {
				container = document.createElement('div');
				container.id = containerIdRef.current || '';
				container.style.position = 'absolute';
				container.style.left = '-9999px';
				container.style.visibility = 'hidden';
				container.style.pointerEvents = 'none';
				if (document.body) {
					document.body.appendChild(container);
				}
			}
			containerRef.current = container;
		}

		// Create React root once, reuse across renders
		if (!rootRef.current) {
			rootRef.current = createRoot(container);
		}

		const root = rootRef.current;

		// Render global styles
		root.render(
			<GlobalStylesRenderer
				{...{
					...blockType,
					renderInPortal: false,
					styleVariationName: variation,
					isStyleVariation: Boolean(variation),
					variationClassPrefix,
					sanitizedBlockGlobalStyles,
				}}
			/>
		);

		// Extract styles after React has flushed updates
		// Use requestAnimationFrame to ensure DOM is updated
		const rafId = requestAnimationFrame(() => {
			if (!isMountedRef.current || !container) {
				return;
			}

			timeoutRef.current = setTimeout(() => {
				const extractedStyles = extractStylesFromContainer(container);

				// Only update state if styles actually changed
				if (extractedStyles !== lastStylesRef.current) {
					lastStylesRef.current = extractedStyles;
					setAdditionalStyles(extractedStyles);
				}
			}, 0);
		});

		return () => {
			cancelAnimationFrame(rafId);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		blockTypeName,
		variation,
		variationClassPrefix,
		sanitizedBlockGlobalStyles,
	]);

	// Cleanup on unmount
	useLayoutEffect(() => {
		return () => {
			isMountedRef.current = false;

			// Unmount React root
			if (rootRef.current) {
				try {
					rootRef.current.unmount();
				} catch (e) {
					// Ignore unmount errors (root may already be unmounted)
				}
				rootRef.current = null;
			}

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}

			// Remove container element
			if (containerRef.current && containerRef.current.parentNode) {
				try {
					containerRef.current.parentNode.removeChild(
						containerRef.current
					);
				} catch (e) {
					// Ignore removal errors (element may already be removed)
				}
				containerRef.current = null;
			}
		};
	}, []);

	return additionalStyles;
};
