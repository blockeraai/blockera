// @flow

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { componentClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { default as ColorIndicator } from './color-indicator';

export default function ColorIndicatorStack({
	className,
	value,
	size,
	maxItems,
	...props
}: Object): MixedElement {
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
					value={value?.value ? value?.value : value}
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

ColorIndicatorStack.propTypes = {
	/**
	 * Array of color stacks. You can pass a flat array of colors or an array of objects containing `value` and `type`.
	 */
	value: PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.shape({
				value: PropTypes.string,
				type: PropTypes.string,
			}),
		])
	),
	/**
	 * Sets the size of indicator
	 */
	size: PropTypes.number,
	/**
	 * Specifies the max count of value items to be shown
	 */
	maxItems: PropTypes.number,
};

ColorIndicatorStack.defaultProps = {
	value: [],
	size: 18,
	maxItems: 8,
};
