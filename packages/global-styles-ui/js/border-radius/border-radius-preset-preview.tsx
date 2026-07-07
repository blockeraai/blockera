/**
 * External dependencies
 */
import type { CSSProperties } from 'react';

/**
 * Internal dependencies
 */
import { VariablePreview } from '../components/variable-preview';
import { radiusPresetSizeToString, radiusSizeToPreviewCss } from './utils';

const PREVIEW_SIZE = 50;

const INNER_BASE: CSSProperties = {
	display: 'inline-block',
	width: PREVIEW_SIZE,
	height: PREVIEW_SIZE,
	boxSizing: 'border-box',
	flexShrink: 0,
	verticalAlign: 'middle',
};

const EMPTY_PREVIEW_STYLE: CSSProperties = {
	...INNER_BASE,
	borderRadius: 0,
	background:
		'color-mix(in srgb, var(--blockera-controls-primary-color) 20%, transparent)',
	border: '1px solid var(--blockera-controls-primary-color)',
};

export type BorderRadiusPresetPreviewProps = {
	size: string | number;
};

export default function BorderRadiusPresetPreview({
	size,
}: BorderRadiusPresetPreviewProps) {
	// Match opener / CSS path: value-addon objects must resolve before emptiness check.
	const raw = radiusPresetSizeToString(size);

	const inner = !raw ? (
		<span aria-hidden style={EMPTY_PREVIEW_STYLE} />
	) : (
		<span
			aria-hidden
			style={{
				...INNER_BASE,
				borderRadius: radiusSizeToPreviewCss(size),
				background:
					'color-mix(in srgb, var(--blockera-controls-primary-color) 20%, transparent)',
				border: '1px solid var(--blockera-controls-primary-color)',
			}}
		/>
	);

	return <VariablePreview type="border-radius">{inner}</VariablePreview>;
}
