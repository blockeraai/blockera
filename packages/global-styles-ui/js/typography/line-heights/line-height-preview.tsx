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
		'background-color':
			'color-mix(in srgb, var(--blockera-controls-primary-color) 20%, #fff 100%)',
		display: 'inline-block',
		width: '100%',
		textAlign: 'center',
	};

	return (
		<VariablePreview type="line-height">
			<span style={previewStyle}>{__('Aa', 'blockera')}</span>
		</VariablePreview>
	);
}

export default LineHeightPreview;
