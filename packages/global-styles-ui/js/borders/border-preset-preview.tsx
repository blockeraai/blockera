/**
 * External dependencies
 */
import React from 'react';

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { BorderPresetStoredSide } from './utils';
import { coerceBorderPresetSide, resolveBorderColorString } from './utils';

const PREVIEW_SIZE = 28;

const PREVIEW_GRADIENT =
	'linear-gradient(145deg, rgba(56, 88, 233, 0.22), rgba(56, 88, 233, 0.08))';

const EMPTY_PREVIEW_STYLE: React.CSSProperties = {
	display: 'inline-block',
	width: PREVIEW_SIZE,
	height: PREVIEW_SIZE,
	boxSizing: 'border-box',
	borderRadius: 0,
	border: '1px dashed rgba(120, 120, 120, 0.45)',
	background: 'rgba(120, 120, 120, 0.06)',
	flexShrink: 0,
	verticalAlign: 'middle',
};

/** Keeps thick theme borders from dominating the mini preview. */
const MAX_EDGE_PX = 5;

function clampBorderWidthForPreview(width: string): string {
	const raw = String(width ?? '').trim();
	if (!raw) {
		return '1px';
	}
	const m = raw.match(/^([\d.]+)(\s*)(px)$/i);
	if (!m) {
		return raw;
	}
	const n = parseFloat(m[1]);
	if (Number.isNaN(n)) {
		return raw;
	}
	const clamped = Math.min(MAX_EDGE_PX, Math.max(0.5, n));
	return `${clamped}px`;
}

const PREVIEW_CENTER_WRAP: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: '100%',
	boxSizing: 'border-box',
	padding: '10px 12px',
};

export type BorderPresetPreviewProps = {
	border: BorderPresetStoredSide | undefined;
};

export default function BorderPresetPreview({
	border,
}: BorderPresetPreviewProps) {
	const wrap = (inner: React.ReactNode) => (
		<div
			className={classNames(
				'global-styles-ui-preset-preview',
				'global-styles-ui-border-preset-preview'
			)}
			style={PREVIEW_CENTER_WRAP}
		>
			{inner}
		</div>
	);

	if (!border) {
		return wrap(<span style={EMPTY_PREVIEW_STYLE} />);
	}

	const side = coerceBorderPresetSide(border);
	const w = String(side.width ?? '').trim();
	const st = String(side.style ?? '').trim();
	const hasAny =
		w !== '' ||
		st !== '' ||
		resolveBorderColorString(
			side.color as string | Record<string, unknown> | undefined
		) !== '';

	if (!hasAny) {
		return wrap(<span style={EMPTY_PREVIEW_STYLE} />);
	}

	const bw = clampBorderWidthForPreview(w || '1px');
	const bs = st || 'solid';
	const bc =
		resolveBorderColorString(
			side.color as string | Record<string, unknown> | undefined
		) || 'rgba(56, 88, 233, 0.45)';

	return wrap(
		<span
			aria-hidden
			style={{
				display: 'inline-block',
				width: PREVIEW_SIZE,
				height: PREVIEW_SIZE,
				boxSizing: 'border-box',
				borderRadius: 6,
				background: PREVIEW_GRADIENT,
				borderWidth: bw,
				borderStyle: bs,
				borderColor: bc,
				flexShrink: 0,
				verticalAlign: 'middle',
			}}
		/>
	);
}
