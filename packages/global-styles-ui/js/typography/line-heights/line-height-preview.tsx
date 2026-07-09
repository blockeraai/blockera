/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { CSSProperties } from 'react';

/**
 * Internal dependencies
 */
import { VariablePreview } from '../../components/variable-preview';
import { useGlobalStyle } from '../../context/global-style-hooks';

type LineHeightPreset = {
	size: string;
};

interface LineHeightPreviewProps {
	lineHeight: LineHeightPreset;
}

function LineHeightPreview({ lineHeight }: LineHeightPreviewProps) {
	const [typographyStyle] = useGlobalStyle('typography', '');
	const fontFamily =
		typeof typographyStyle.fontFamily === 'string'
			? typographyStyle.fontFamily
			: undefined;

	const previewStyle: CSSProperties = {
		lineHeight: lineHeight.size,
		fontFamily,
		color: 'var(--blockera-controls-primary-color)',
	};

	return (
		<VariablePreview type="line-height" style={previewStyle}>
			{__('Aa', 'blockera')}
		</VariablePreview>
	);
}

export default LineHeightPreview;
