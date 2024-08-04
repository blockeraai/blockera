//@flow

/**
 * External dependencies
 */
import type { Node } from 'react';

/**
 * Blockera dependencies
 */
import { isObject } from '@blockera/utils';
import { componentClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import {
	getValueAddonRealValue,
	isValid as isValidVariable,
} from '../../value-addons';
import type { ColorIndicatorProps } from './types';

export default function ColorIndicator({
	className,
	value = '',
	type = 'color',
	size = 16,
	style,
	...props
}: ColorIndicatorProps): Node {
	if (isObject(value) && isValidVariable(value)) {
		value = getValueAddonRealValue(value);
	}

	const customStyle: {
		width?: string,
		height?: string,
		background?: string,
		backgroundImage?: string,
		backgroundPosition?: string,
		backgroundSize?: string,
	} = {};

	let styleClassName = '';

	if (size !== 16) {
		customStyle.width = Number(size) + 'px';
		customStyle.height = Number(size) + 'px';
	}

	switch (type) {
		case '':
		case 'color':
			if (value !== '' && value !== 'none') {
				customStyle.background = value;
			}

			styleClassName =
				'color-' +
				(value === '' || value === 'none' ? 'none' : 'custom');
			break;

		case 'image':
			if (value !== '' && value !== 'none') {
				customStyle.backgroundImage = `url(${value})`;
				styleClassName = 'image-custom';
			} else {
				customStyle.backgroundImage =
					'repeating-conic-gradient(#c7c7c7 0%, #c7c7c7 25%, transparent 0%, transparent 50%)'; // transparent image
				customStyle.backgroundPosition = '50% center';
				customStyle.backgroundSize = '10px 10px';
				styleClassName = 'image-none';
			}
			break;

		case 'gradient':
			if (value !== '' && value !== 'none') {
				customStyle.backgroundImage = value;
				styleClassName = 'gradient-custom';
			} else {
				styleClassName = 'gradient-none';
			}
			break;

		default:
			return <></>;
	}

	return (
		<span
			{...props}
			style={{ ...customStyle, ...style }}
			className={componentClassNames(
				'color-indicator',
				styleClassName,
				className
			)}
		/>
	);
}
