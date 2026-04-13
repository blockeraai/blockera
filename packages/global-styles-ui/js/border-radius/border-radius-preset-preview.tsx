/**
 * External dependencies
 */
import type { CSSProperties } from 'react';

/**
 * Internal dependencies
 */
import { VariablePreview } from '../components/variable-preview';
import { radiusSizeToPreviewCss } from './utils';

const PREVIEW_SIZE = 50;

const PREVIEW_GRADIENT =
	'linear-gradient(145deg, rgba(56, 88, 233, 0.22), rgba(56, 88, 233, 0.08))';

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
	border: '1px dashed rgba(120, 120, 120, 0.45)',
	background: 'rgba(120, 120, 120, 0.06)',
};

export type BorderRadiusPresetPreviewProps = {
	size: string | number;
};

export default function BorderRadiusPresetPreview({
	size,
}: BorderRadiusPresetPreviewProps) {
	const raw = String(size ?? '').trim();

	const inner = !raw ? (
		<span aria-hidden style={EMPTY_PREVIEW_STYLE} />
	) : (
		<span
			aria-hidden
			style={{
				...INNER_BASE,
				borderRadius: radiusSizeToPreviewCss(size),
				background: PREVIEW_GRADIENT,
				border: '1px solid rgba(56, 88, 233, 0.35)',
			}}
		/>
	);

	return <VariablePreview type="border-radius">{inner}</VariablePreview>;
}
