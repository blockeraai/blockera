/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { FontSize } from '@wordpress/global-styles-engine';
import { getComputedFluidTypographyValue } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { VariablePreview } from '../components/variable-preview';
import { useGlobalStyle } from '../context/global-style-hooks';

interface FontSizePreviewProps {
	fontSize: FontSize;
}

function FontSizePreview({ fontSize }: FontSizePreviewProps) {
	const [typographyStyle] = useGlobalStyle('typography', '');
	const fontFamily =
		typeof typographyStyle.fontFamily === 'string'
			? typographyStyle.fontFamily
			: undefined;

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

	const computedFontSize = String(
		getComputedFluidTypographyValue(input) ?? ''
	);

	return (
		<VariablePreview
			type="font-size"
			style={{
				fontSize: computedFontSize,
				fontFamily,
				color: 'var(--blockera-controls-primary-color)',
			}}
		>
			{__('Aa', 'blockera')}
		</VariablePreview>
	);
}

export default FontSizePreview;
