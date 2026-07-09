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

export default function ColorIndicatorStack({
	className,
	value = [],
	size = 16,
	maxItems = 8,
	...props
}: ColorIndicatorStackProps): MixedElement {
	if (!value?.length) {
		return <></>;
	}

	const colorsStack = [];

	value
		.slice(0, maxItems)
		.reverse()
		.map((value, index) => {
			colorsStack.push(
				<ColorIndicator
					key={index}
					//$FlowFixMe
					value={value?.value ? value?.value : value}
					//$FlowFixMe
					type={value?.type ? value.type : 'color'}
					size={size}
					{...props}
				/>
			);
			return null;
		});

	let space: string;
	if (colorsStack?.length === 1) {
		space = '0';
	} else if (colorsStack?.length <= 2) {
		space = '-3px';
	} else if (colorsStack?.length < 4) {
		space = '-5px';
	} else if (colorsStack?.length < 6) {
		space = '-7px';
	} else if (colorsStack?.length <= 11) {
		space = '-9px';
	} else if (colorsStack?.length > 11) {
		space = '-10px';
	}

	return (
		<div
			className={componentClassNames('color-indicator-stack', className)}
			style={{
				'--stack-space': space,
			}}
		>
			{colorsStack}
		</div>
	);
}
