/**
 * External dependencies
 */
import React from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { ColorIndicator, Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { BoxBorderValue } from './utils';
import {
	areAllFourCustomSidesEqual,
	areCustomSidesTbLrPairs,
	BORDER_SIDE_LABELS_SHORT,
	resolveBorderColorString,
} from './utils';

const STYLE_FOR_LINE = new Set(['solid', 'dashed', 'dotted', 'double']);

/** Reused on every render — avoids allocating new style objects for identical flex rows. */
const flexRowCompactHidden: React.CSSProperties = {
	minWidth: 0,
	flexWrap: 'nowrap',
	overflow: 'hidden',
};

const flexRowCompactHiddenMuted: React.CSSProperties = {
	...flexRowCompactHidden,
	maxWidth: '100%',
	opacity: 0.92,
};

function normalizeLineStyle(
	style: string
): React.CSSProperties['borderTopStyle'] {
	const s = String(style || 'solid')
		.trim()
		.toLowerCase();
	if (STYLE_FOR_LINE.has(s)) {
		return s as React.CSSProperties['borderTopStyle'];
	}
	return 'solid';
}

function normalizeStyleCompare(style: string | undefined): string {
	return (
		String(style ?? '')
			.trim()
			.toLowerCase() || 'solid'
	);
}

/**
 * Tiny horizontal stroke using CSS border-top (solid / dashed / dotted / double).
 */
function BorderStyleLine({ style }: { style: string }) {
	const cssStyle = normalizeLineStyle(style);
	const thick = cssStyle === 'double' ? 3 : 2;

	return (
		<span
			aria-hidden
			title={String(style || 'solid').trim() || 'solid'}
			style={{
				display: 'inline-block',
				width: 20,
				flexShrink: 0,
				height: 0,
				borderTopWidth: thick,
				borderTopStyle: cssStyle,
				borderTopColor: 'currentColor',
				opacity: 0.82,
				verticalAlign: 'middle',
			}}
		/>
	);
}

function BorderColorIndicator({
	color,
}: {
	color: string | Record<string, unknown> | undefined;
}) {
	if (color === undefined || color === '') {
		return null;
	}
	const resolved = resolveBorderColorString(color);
	if (!resolved && typeof color !== 'object') {
		return null;
	}

	return <ColorIndicator value={color} size={14} />;
}

const borderSideLabelIndicatorStyle: React.CSSProperties = {
	fontSize: 10,
	opacity: 0.7,
	fontWeight: 500,
	flexShrink: 0,
};

/**
 * Compact T / R / B / L (or TB / LR) glyph for border opener rows — single shared style.
 */
function BorderSideLabelIndicator({
	label,
	title: titleProp,
}: {
	label: string;
	title?: string;
}) {
	// Decorative when no tooltip; with title, keep discoverable for screen readers + hover.
	const ariaHidden = titleProp ? undefined : true;
	return (
		<span
			aria-hidden={ariaHidden}
			title={titleProp}
			style={borderSideLabelIndicatorStyle}
		>
			{label}
		</span>
	);
}

/** True if this side contributes anything visible (width, style, or color token). */
function sideHasInk(side: BoxBorderValue['top'] | undefined): boolean {
	if (!side) {
		return false;
	}
	const w = String(side.width ?? '').trim();
	const st = String(side.style ?? '').trim();
	const c = resolveBorderColorString(
		side.color as string | Record<string, unknown> | undefined
	);
	return (
		!!w || !!st || !!c || !!(side.color && typeof side.color === 'object')
	);
}

/**
 * True when every side that has data shares the same border-style and color.
 */
function allActiveSidesShareStyleAndColor(border: BoxBorderValue): boolean {
	const keys = ['top', 'right', 'bottom', 'left'] as const;
	const active: NonNullable<BoxBorderValue['top']>[] = [];
	for (const k of keys) {
		const s = border[k];
		if (sideHasInk(s)) {
			active.push(s!);
		}
	}
	if (active.length <= 1) {
		return true;
	}
	const st0 = normalizeStyleCompare(active[0].style);
	const c0 = resolveBorderColorString(
		active[0].color as string | Record<string, unknown> | undefined
	);
	// Object colors (theme refs, gradients) must compare by value, not reference.
	const id0 =
		typeof active[0].color === 'object' && active[0].color
			? JSON.stringify(active[0].color)
			: '';
	return active.every((side) => {
		const st = normalizeStyleCompare(side.style);
		const c = resolveBorderColorString(
			side.color as string | Record<string, unknown> | undefined
		);
		const id =
			typeof side.color === 'object' && side.color
				? JSON.stringify(side.color)
				: '';
		return st === st0 && c === c0 && id === id0;
	});
}

function firstActiveSide(
	border: BoxBorderValue
): NonNullable<BoxBorderValue['top']> | null {
	const keys = ['top', 'right', 'bottom', 'left'] as const;
	for (const k of keys) {
		const s = border[k];
		if (sideHasInk(s)) {
			return s!;
		}
	}
	return null;
}

function ChunkSep() {
	return (
		<span
			aria-hidden
			style={{
				opacity: 0.4,
				padding: '0 2px',
				fontWeight: 300,
			}}
		>
			·
		</span>
	);
}

function AllSidesValue({ all }: { all: NonNullable<BoxBorderValue['all']> }) {
	const w = String(all.width ?? '').trim();
	const st = String(all.style ?? '').trim();
	const c = resolveBorderColorString(
		all.color as string | Record<string, unknown> | undefined
	);
	const hasColor = c !== '' || (all.color && typeof all.color === 'object');
	const hasAny = w || st || c;

	if (!hasAny) {
		return <span>{__('EMPTY', 'blockera')}</span>;
	}

	return (
		<Flex
			alignItems="center"
			gap={6}
			justifyContent="flex-end"
			style={{ minWidth: 0, flexWrap: 'nowrap' }}
		>
			{w ? (
				<span
					style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12 }}
				>
					{w}
				</span>
			) : null}
			<BorderStyleLine style={st || 'solid'} />
			{hasColor ? (
				<BorderColorIndicator
					color={
						all.color as
							| string
							| Record<string, unknown>
							| undefined
					}
				/>
			) : null}
		</Flex>
	);
}

/** Width + side label only (shared style/color rendered once after). */
function SideWidthChunk({
	sideLabel,
	side,
}: {
	sideLabel: string;
	side: NonNullable<BoxBorderValue['top']>;
}) {
	const w = String(side.width ?? '').trim() || '—';
	return (
		<Flex alignItems="center" gap={3} style={{ flexShrink: 0 }}>
			<BorderSideLabelIndicator label={sideLabel} />
			<span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12 }}>
				{w}
			</span>
		</Flex>
	);
}

/**
 * Per-side width chunks (T/R/B/L + value) shared by the “mixed style/color” row and the deduped row.
 */
function renderCustomSideWidthChunksItems(
	border: BoxBorderValue
): React.ReactNode[] {
	const keys = ['top', 'right', 'bottom', 'left'] as const;
	const items: React.ReactNode[] = [];

	for (let i = 0; i < keys.length; i++) {
		const side = border[keys[i]];
		if (!sideHasInk(side)) {
			continue;
		}
		if (items.length) {
			items.push(<ChunkSep key={`sep-${keys[i]}`} />);
		}
		items.push(
			<SideWidthChunk
				key={keys[i]}
				sideLabel={BORDER_SIDE_LABELS_SHORT[i]}
				side={side!}
			/>
		);
	}

	return items;
}

/**
 * Mixed style/color between sides: same per-side UI as deduped row (no shared style line / swatch).
 *
 * @return Row UI or null — name kept for callers; output is React nodes, not a string.
 */
function buildShortCustomBorderLabel(border: BoxBorderValue): React.ReactNode {
	const items = renderCustomSideWidthChunksItems(border);
	if (!items.length) {
		return null;
	}

	return (
		<Flex
			alignItems="center"
			justifyContent="flex-end"
			gap={2}
			style={flexRowCompactHiddenMuted}
		>
			{items}
		</Flex>
	);
}

function SharedStyleColorSuffix({
	style,
	color,
}: {
	style: string;
	color: string | Record<string, unknown> | undefined;
}) {
	const st = style || 'solid';
	const c = resolveBorderColorString(
		color as string | Record<string, unknown> | undefined
	);
	const hasColor = c !== '' || (color && typeof color === 'object');

	return (
		<>
			<ChunkSep />
			<BorderStyleLine style={st} />
			{hasColor ? <BorderColorIndicator color={color} /> : null}
		</>
	);
}

function DedupedCustomSidesRow({ border }: { border: BoxBorderValue }) {
	const first = firstActiveSide(border);
	if (!first) {
		return <span>{__('EMPTY', 'blockera')}</span>;
	}
	const st = String(first.style ?? '').trim();
	const color = first.color as string | Record<string, unknown> | undefined;

	const items = renderCustomSideWidthChunksItems(border);

	if (!items.length) {
		return <span>{__('EMPTY', 'blockera')}</span>;
	}

	return (
		<Flex
			alignItems="center"
			justifyContent="flex-end"
			gap={2}
			style={flexRowCompactHidden}
		>
			{items}
			<SharedStyleColorSuffix style={st || 'solid'} color={color} />
		</Flex>
	);
}

/**
 * Resolves custom border display: cheapest checks first, then shared-style branches.
 * Order matters — e.g. four equal sides must run before per-side TB/LR / deduped logic.
 */
function CustomSidesValue({ border }: { border: BoxBorderValue }) {
	if (areAllFourCustomSidesEqual(border)) {
		const side = border.top;
		if (!side) {
			return <span>{__('EMPTY', 'blockera')}</span>;
		}
		const w = String(side.width ?? '').trim();
		const st = String(side.style ?? '').trim();
		const c = resolveBorderColorString(
			side.color as string | Record<string, unknown> | undefined
		);
		const hasColor =
			c !== '' || (side.color && typeof side.color === 'object');
		const hasAny = w || st || c;

		if (!hasAny) {
			return <span>{__('EMPTY', 'blockera')}</span>;
		}

		return (
			<Flex
				alignItems="center"
				gap={6}
				justifyContent="flex-end"
				style={{ minWidth: 0, flexWrap: 'nowrap' }}
			>
				{w ? (
					<span
						style={{
							fontVariantNumeric: 'tabular-nums',
							fontSize: 12,
						}}
					>
						{w}
					</span>
				) : null}
				<BorderStyleLine style={st || 'solid'} />
				{hasColor ? (
					<BorderColorIndicator
						color={
							side.color as
								| string
								| Record<string, unknown>
								| undefined
						}
					/>
				) : null}
			</Flex>
		);
	}

	if (!firstActiveSide(border)) {
		return <span>{__('EMPTY', 'blockera')}</span>;
	}

	if (!allActiveSidesShareStyleAndColor(border)) {
		return (
			buildShortCustomBorderLabel(border) ?? (
				<span>{__('EMPTY', 'blockera')}</span>
			)
		);
	}

	const pair = areCustomSidesTbLrPairs(border);
	if (pair) {
		const [tb, lr] = pair;
		const wT = String(tb.width ?? '').trim();
		const wL = String(lr.width ?? '').trim();
		const st = String(tb.style ?? '').trim();
		const color = tb.color as string | Record<string, unknown> | undefined;

		return (
			<Flex
				alignItems="center"
				gap={5}
				justifyContent="flex-end"
				style={{ minWidth: 0, flexWrap: 'nowrap' }}
			>
				<BorderSideLabelIndicator
					label="TB"
					title={__('Top & bottom', 'blockera')}
				/>
				{wT ? (
					<span
						style={{
							fontVariantNumeric: 'tabular-nums',
							fontSize: 12,
						}}
					>
						{wT}
					</span>
				) : null}
				<ChunkSep />
				<BorderSideLabelIndicator
					label="LR"
					title={__('Left & right', 'blockera')}
				/>
				{wL ? (
					<span
						style={{
							fontVariantNumeric: 'tabular-nums',
							fontSize: 12,
						}}
					>
						{wL}
					</span>
				) : null}
				<SharedStyleColorSuffix style={st || 'solid'} color={color} />
			</Flex>
		);
	}

	return <DedupedCustomSidesRow border={border} />;
}

export type BorderPresetOpenerValueProps = {
	border: BoxBorderValue | undefined;
};

function BorderPresetOpenerValueInner({
	border,
}: BorderPresetOpenerValueProps) {
	if (!border) {
		return <span>{__('EMPTY', 'blockera')}</span>;
	}

	if (border.type === 'all' && border.all) {
		return <AllSidesValue all={border.all} />;
	}

	if (border.type === 'custom') {
		return <CustomSidesValue border={border} />;
	}

	return <span>{__('EMPTY', 'blockera')}</span>;
}

/** Memoized: repeater headers re-render often; skip subtree when `border` reference is unchanged. */
export const BorderPresetOpenerValue = React.memo(BorderPresetOpenerValueInner);
BorderPresetOpenerValue.displayName = 'BorderPresetOpenerValue';
