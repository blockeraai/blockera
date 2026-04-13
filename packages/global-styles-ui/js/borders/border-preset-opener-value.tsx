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
import type { BorderPresetStoredSide } from './utils';
import { coerceBorderPresetSide, resolveBorderColorString } from './utils';

const STYLE_FOR_LINE = new Set(['solid', 'dashed', 'dotted', 'double']);

const flexRowCompact: React.CSSProperties = {
	minWidth: 0,
	flexWrap: 'nowrap',
	overflow: 'hidden',
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

function FlatBorderPresetValue({ side }: { side: BorderPresetStoredSide }) {
	const w = String(side.width ?? '').trim();
	const st = String(side.style ?? '').trim();
	const c = resolveBorderColorString(
		side.color as string | Record<string, unknown> | undefined
	);
	const hasColor = c !== '' || (side.color && typeof side.color === 'object');
	const hasAny = w || st || c;

	if (!hasAny) {
		return <span>{__('EMPTY', 'blockera')}</span>;
	}

	return (
		<Flex
			alignItems="center"
			gap={6}
			justifyContent="flex-end"
			style={{ minWidth: 0, flexWrap: 'nowrap', ...flexRowCompact }}
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

export type BorderPresetOpenerValueProps = {
	border: BorderPresetStoredSide | undefined;
};

function BorderPresetOpenerValueInner({
	border,
}: BorderPresetOpenerValueProps) {
	if (!border) {
		return <span>{__('EMPTY', 'blockera')}</span>;
	}

	return <FlatBorderPresetValue side={coerceBorderPresetSide(border)} />;
}

/** Memoized: repeater headers re-render often; skip subtree when `border` reference is unchanged. */
export const BorderPresetOpenerValue = React.memo(BorderPresetOpenerValueInner);
BorderPresetOpenerValue.displayName = 'BorderPresetOpenerValue';
