/**
 * External dependencies
 */
import type { CSSProperties } from 'react';

/**
 * Internal dependencies
 */
import { VariablePreview } from '../components/variable-preview';
import type { BorderPresetStoredSide } from './utils';
import { coerceBorderPresetSide, resolveBorderColorString } from './utils';

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
	border: '1px solid var(--blockera-controls-primary-color)',
};

export type BorderPresetPreviewProps = {
	border: BorderPresetStoredSide | undefined;
};

/** True when the preset has nothing to draw (width, style, and resolved color are all empty). */
function isStoredSideVisuallyEmpty(side: BorderPresetStoredSide): boolean {
	const w = String(side.width ?? '').trim();
	const st = String(side.style ?? '').trim();
	const colorResolved = resolveBorderColorString(
		side.color as string | Record<string, unknown> | undefined
	);
	return w === '' && st === '' && colorResolved === '';
}

export default function BorderPresetPreview({
	border,
}: BorderPresetPreviewProps) {
	// One coercion: invalid / missing input becomes empty defaults (same as theme.json sanitize path).
	const side = coerceBorderPresetSide(border);

	if (isStoredSideVisuallyEmpty(side)) {
		return (
			<VariablePreview type="border">
				<span aria-hidden style={EMPTY_PREVIEW_STYLE} />
			</VariablePreview>
		);
	}

	const w = String(side.width ?? '').trim();
	const st = String(side.style ?? '').trim();
	const bw = w || '1px';
	const bs = st || 'solid';
	const bc =
		resolveBorderColorString(
			side.color as string | Record<string, unknown> | undefined
		) || 'var(--blockera-controls-primary-color)';

	return (
		<VariablePreview type="border">
			<span
				aria-hidden
				style={{
					...INNER_BASE,
					borderWidth: bw,
					borderStyle: bs,
					borderColor: bc,
				}}
			/>
		</VariablePreview>
	);
}
