// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { componentClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { default as ColorIndicator } from './color-indicator';
import type { ColorIndicatorStackProps } from './types';

/**
 * Distance from the middle item (left-middle for even counts).
 */
function getCenteredStackDistance(index: number, count: number): number {
	const centerIndex = Math.floor((count - 1) / 2);
	return Math.abs(index - centerIndex);
}

/**
 * Peak z-index at the middle item.
 * Left of center rises toward the peak; right of center falls away.
 */
function getCenteredStackZIndex(index: number, count: number): number {
	return count - getCenteredStackDistance(index, count);
}

/**
 * Peak size at the middle item; each step away reduces size by 2px.
 * e.g. size 18 → center 18, neighbors 16, then 14, …
 */
function getCenteredStackItemSize(
	size: number,
	index: number,
	count: number
): number {
	return Math.max(
		1,
		Number(size) - getCenteredStackDistance(index, count) * 2
	);
}

function getAutoStackSpace(count: number): string {
	if (count === 1) {
		return '0';
	}
	if (count <= 2) {
		return '-3px';
	}
	if (count < 4) {
		return '-5px';
	}
	if (count < 6) {
		return '-7px';
	}
	if (count <= 11) {
		return '-9px';
	}
	return '-10px';
}

function resolveStackSpace(
	space: number | string | void,
	count: number
): string {
	if (space === undefined || space === null || space === '') {
		return getAutoStackSpace(count);
	}
	if (typeof space === 'number') {
		return `${space}px`;
	}
	return String(space);
}

export default function ColorIndicatorStack({
	className,
	value = [],
	size = 16,
	maxItems = 8,
	displayMode = 'normal',
	space,
	...props
}: ColorIndicatorStackProps): MixedElement {
	if (!value?.length) {
		return <></>;
	}

	const items = value.slice(0, maxItems).reverse();
	const count = items.length;
	const isCentered = displayMode === 'centered';
	const stackSpace = resolveStackSpace(space, count);

	const colorsStack = items.map((item, index) => (
		<ColorIndicator
			key={index}
			//$FlowFixMe
			value={item?.value ? item?.value : item}
			//$FlowFixMe
			type={item?.type ? item.type : 'color'}
			size={
				isCentered ? getCenteredStackItemSize(size, index, count) : size
			}
			{...props}
			style={
				isCentered
					? { zIndex: getCenteredStackZIndex(index, count) }
					: undefined
			}
		/>
	));

	return (
		<div
			className={componentClassNames(
				'color-indicator-stack',
				isCentered && 'color-indicator-stack--centered',
				className
			)}
			style={{
				'--stack-space': stackSpace,
			}}
		>
			{colorsStack}
		</div>
	);
}
