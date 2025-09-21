// @flow

/**
 * External dependencies
 */
import { useState, useEffect, createRoot, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { GlobalStylesRenderer } from '../../extensions/components/global-styles-renderer';

export const useBlockPreviewStyles = (
	blockType: Object,
	variation: string
): string => {
	const [additionalStyles, setAdditionalStyles] = useState('');

	// Memoize props passed to GlobalStylesRenderer to prevent unnecessary re-renders
	const rendererProps = useMemo(
		() => ({
			...blockType,
			renderInPortal: false,
			styleVariationName: variation,
			isStyleVariation: Boolean(variation),
		}),
		[blockType, variation]
	);

	useEffect(() => {
		const tempElementId = 'blockera-global-styles-preview-panel';
		let tempElement = document.querySelector(`#${tempElementId}`);
		let root;

		// Reuse existing element if possible
		if (!tempElement) {
			tempElement = document.createElement('div');
			tempElement.id = tempElementId;
			document.body.appendChild(tempElement);
		}

		try {
			root = createRoot(tempElement);
			// Render global styles
			root.render(<GlobalStylesRenderer {...rendererProps} />);

			// Debounce observer callback to reduce unnecessary updates
			let timeoutId;
			const observer = new MutationObserver(() => {
				if (timeoutId) {
					clearTimeout(timeoutId);
				}

				timeoutId = setTimeout(() => {
					const newStyles = tempElement?.textContent || '';
					if (additionalStyles !== newStyles) {
						setAdditionalStyles(newStyles);
					}
				}, 100);
			});

			// Observe changes to the temp element
			observer.observe(tempElement, {
				childList: true,
				subtree: true,
				characterData: true,
			});

			return () => {
				clearTimeout(timeoutId);
				observer.disconnect();
				if (root) {
					root.unmount();
				}
				if (tempElement && document.body.contains(tempElement)) {
					document.body.removeChild(tempElement);
				}
			};
		} catch (error) {
			console.error('Error in useBlockPreviewStyles:', error);
			return () => {
				if (tempElement && document.body.contains(tempElement)) {
					document.body.removeChild(tempElement);
				}
			};
		}
	}, [rendererProps, additionalStyles]);

	return additionalStyles;
};
