// @flow

/**
 * External dependencies
 */
import { useState, useEffect, createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { GlobalStylesRenderer } from '../../extensions/components/global-styles-renderer';

export const useBlockPreviewStyles = (
	blockType: Object,
	variation: string
): string => {
	const [additionalStyles, setAdditionalStyles] = useState('');

	useEffect(() => {
		const tempElementId = 'blockera-global-styles-preview-panel';
		const prevTempElement = document.querySelector(`#${tempElementId}`);

		if (prevTempElement) {
			document.body.removeChild(prevTempElement);
		}

		// Create temporary container for styles
		const tempElement = document.createElement('div');
		tempElement.id = tempElementId;
		document.body.appendChild(tempElement);
		const root = createRoot(tempElement);

		// Render global styles
		root.render(
			<GlobalStylesRenderer
				{...{
					...blockType,
					renderInPortal: false,
					styleVariationName: variation,
					isStyleVariation: Boolean(variation),
				}}
			/>
		);

		const observer = new MutationObserver(() => {
			// Only update if styles have changed
			if (additionalStyles !== tempElement.textContent) {
				setAdditionalStyles(tempElement.textContent);

				tempElement.remove();
			}
		});

		// Observe changes to the temp element
		observer.observe(tempElement, {
			childList: true,
			subtree: true,
			characterData: true,
		});

		return () => {
			observer.disconnect();
			root.unmount();
			document.body.removeChild(tempElement);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [blockType, variation]); // Remove additionalStyles dependency to prevent loops

	return additionalStyles;
};
