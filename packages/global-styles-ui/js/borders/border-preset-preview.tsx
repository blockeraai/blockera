/**
 * External dependencies
 */
import React from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { BoxBorderValue } from './utils';
import { resolveBorderColorString } from './utils';

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

type Side = {
	width: string;
	style: string;
	color: string | Record<string, unknown>;
};

function normalizeSide(side: Side | undefined): Side {
	return {
		width: side?.width ?? '',
		style: side?.style ?? '',
		color: side?.color ?? '',
	};
}

function sideHasInk(s: Side): boolean {
	return (
		String(s.width ?? '').trim() !== '' ||
		String(s.style ?? '').trim() !== '' ||
		resolveBorderColorString(s.color) !== ''
	);
}

function edgeFromSide(s: Side) {
	const bw = clampBorderWidthForPreview(
		String(s.width ?? '').trim() || '1px'
	);
	const bs = String(s.style ?? '').trim() || 'solid';
	const bc = resolveBorderColorString(s.color) || 'rgba(56, 88, 233, 0.45)';
	return { width: bw, style: bs, color: bc };
}

/**
 * Per-side preview: four edges as real CSS borders around a centered fill, sized for narrow panels.
 * Uses a column layout so each edge gets a clear band without needing a wide canvas.
 */
function CustomSidesPreviewFrame({
	top,
	right,
	bottom,
	left,
}: {
	top: ReturnType<typeof edgeFromSide>;
	right: ReturnType<typeof edgeFromSide>;
	bottom: ReturnType<typeof edgeFromSide>;
	left: ReturnType<typeof edgeFromSide>;
}) {
	const frameSize = 46;
	const innerFlex = 1;

	return (
		<div
			role="img"
			aria-label={__('Per-side border preview', 'blockera')}
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: frameSize,
				maxWidth: '100%',
				height: frameSize,
				maxHeight: 52,
				borderRadius: 8,
				overflow: 'hidden',
				boxSizing: 'border-box',
				boxShadow: 'inset 0 0 0 1px rgba(15, 23, 42, 0.06)',
				flexShrink: 0,
			}}
		>
			{/* Top edge */}
			<div
				style={{
					flexShrink: 0,
					height: 0,
					borderTop: `${top.width} ${top.style} ${top.color}`,
					width: '100%',
				}}
			/>
			{/* Middle: left | fill | right */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					flex: innerFlex,
					minHeight: 0,
					minWidth: 0,
					alignItems: 'stretch',
				}}
			>
				<div
					style={{
						flexShrink: 0,
						width: 0,
						alignSelf: 'stretch',
						borderLeft: `${left.width} ${left.style} ${left.color}`,
					}}
				/>
				<div
					style={{
						flex: 1,
						minWidth: 0,
						background: PREVIEW_GRADIENT,
					}}
				/>
				<div
					style={{
						flexShrink: 0,
						width: 0,
						alignSelf: 'stretch',
						borderRight: `${right.width} ${right.style} ${right.color}`,
					}}
				/>
			</div>
			{/* Bottom edge */}
			<div
				style={{
					flexShrink: 0,
					height: 0,
					borderBottom: `${bottom.width} ${bottom.style} ${bottom.color}`,
					width: '100%',
				}}
			/>
		</div>
	);
}

export type BorderPresetPreviewProps = {
	border: BoxBorderValue | undefined;
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

	if (border.type === 'all' && border.all) {
		const { width, style, color } = border.all;
		const w = String(width ?? '').trim();
		const st = String(style ?? '').trim();
		const hasAny =
			w !== '' ||
			st !== '' ||
			resolveBorderColorString(
				color as string | Record<string, unknown> | undefined
			) !== '';

		if (!hasAny) {
			return wrap(<span style={EMPTY_PREVIEW_STYLE} />);
		}

		const bw = clampBorderWidthForPreview(w || '1px');
		const bs = st || 'solid';
		const bc =
			resolveBorderColorString(
				color as string | Record<string, unknown> | undefined
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

	if (border.type === 'custom') {
		const top = normalizeSide(border.top as Side | undefined);
		const right = normalizeSide(border.right as Side | undefined);
		const bottom = normalizeSide(border.bottom as Side | undefined);
		const left = normalizeSide(border.left as Side | undefined);

		if (
			!sideHasInk(top) &&
			!sideHasInk(right) &&
			!sideHasInk(bottom) &&
			!sideHasInk(left)
		) {
			return wrap(<span style={EMPTY_PREVIEW_STYLE} />);
		}

		const t = edgeFromSide(top);
		const r = edgeFromSide(right);
		const b = edgeFromSide(bottom);
		const l = edgeFromSide(left);

		return wrap(
			<CustomSidesPreviewFrame top={t} right={r} bottom={b} left={l} />
		);
	}

	return wrap(<span style={EMPTY_PREVIEW_STYLE} />);
}
