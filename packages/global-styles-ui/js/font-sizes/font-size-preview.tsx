/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { FontSize } from '@wordpress/global-styles-engine';
import { getComputedFluidTypographyValue } from '@wordpress/block-editor';

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { useGlobalStyle } from '../context/global-style-hooks';

interface FontSizePreviewProps {
	fontSize: FontSize;
}

function FontSizePreview({ fontSize }: FontSizePreviewProps) {
	const [font] = useGlobalStyle<{ fontFamily?: string }>('typography');

	const input =
		typeof fontSize?.fluid === 'object' &&
		fontSize?.fluid?.min &&
		fontSize?.fluid?.max
			? {
					minimumFontSize: fontSize.fluid.min,
					maximumFontSize: fontSize.fluid.max,
				}
			: {
					fontSize: fontSize.size,
				};

	const computedFontSize = getComputedFluidTypographyValue(input);
	return (
		<div
			className={classNames(
				'global-styles-ui-preset-preview',
				'global-styles-ui-typography-preview'
			)}
			style={{
				fontSize: computedFontSize,
				fontFamily: font?.fontFamily ?? 'serif',
			}}
		>
			{__('Aa', 'blockera')}
		</div>
	);
}

export default FontSizePreview;
