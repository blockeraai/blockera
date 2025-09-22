// @flow

/**
 * External dependencies
 */
import { useState, useEffect, createRoot } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { omitWithPattern } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { sanitizeBlockAttributes } from '../../extensions/hooks/utils';
import { GlobalStylesRenderer } from '../../extensions/components/global-styles-renderer';

export const useBlockPreviewStyles = (
	blockType: Object,
	variation: string,
	styles: Object
): string => {
	const [additionalStyles, setAdditionalStyles] = useState('');
	const omittedStyles = omitWithPattern(styles, /^(?!blockera).*/i);
	const blockeraBlockTypeGlobalStyles = sanitizeBlockAttributes({
		...omittedStyles,
		blockeraBlockStates: {
			value: {
				...(omittedStyles?.blockeraBlockStates?.value || {}),
				normal: {
					breakpoints: {},
					isVisible: true,
				},
			},
		},
		blockeraPropsId: Math.random().toString(36).substring(2, 15),
	});

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
					blockeraBlockTypeGlobalStyles,
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
			if (document.getElementById(tempElementId)) {
				document.getElementById(tempElementId).remove();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [blockType, variation, blockeraBlockTypeGlobalStyles]); // Remove additionalStyles dependency to prevent loops

	return additionalStyles;
};
