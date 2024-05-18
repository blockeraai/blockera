//@flow

/**
 * External dependencies
 */
import type { Node } from 'react';
import { useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isObject } from '@blockera/utils';
import { componentClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { ColorIndicatorProps } from './types';

const noneType = '';
const supportedTypes = [noneType, 'color', 'image', 'gradient'];

const getRealValue = async (recievedValue: string): Promise<string> => {
	const { isValid, getValueAddonRealValue } = await import(
		'@blockera/editor'
	);

	if (!isObject(recievedValue) || !isValid(recievedValue)) {
		return recievedValue;
	}

	return getValueAddonRealValue(recievedValue);
};

export default function ColorIndicator({
	style,
	className,
	value: _value = '',
	size = 16,
	type = 'color',
	checkIsValueAddon = true,
	...props
}: ColorIndicatorProps): Node {
	const [customStyle, setCustomStyle] = useState({});
	const [styleClassName, setStyleClassName] = useState('');

	const updateStyleStates = (newValue: any) => {
		const _customStyle: {
			width?: string,
			height?: string,
			background?: string,
			backgroundImage?: string,
			backgroundPosition?: string,
			backgroundSize?: string,
		} = {};

		let _styleClassName = '';

		if (size !== 16) {
			_customStyle.width = Number(size) + 'px';
			_customStyle.height = Number(size) + 'px';
		}

		switch (type) {
			case '':
			case 'color':
				if (newValue !== '' && newValue !== 'none') {
					_customStyle.background = newValue;
				}

				_styleClassName =
					'color-' +
					(newValue === '' || newValue === 'none'
						? 'none'
						: 'custom');
				break;

			case 'image':
				if (newValue !== '' && newValue !== 'none') {
					_customStyle.backgroundImage = `url(${newValue})`;
					_styleClassName = 'image-custom';
				} else {
					_customStyle.backgroundImage =
						'repeating-conic-gradient(#c7c7c7 0%, #c7c7c7 25%, transparent 0%, transparent 50%)'; // transparent image
					_customStyle.backgroundPosition = '50% center';
					_customStyle.backgroundSize = '10px 10px';
					_styleClassName = 'image-none';
				}
				break;

			case 'gradient':
				if (newValue !== '' && newValue !== 'none') {
					_customStyle.backgroundImage = newValue;
					_styleClassName = 'gradient-custom';
				} else {
					_styleClassName = 'gradient-none';
				}
				break;
		}

		setCustomStyle(_customStyle);
		setStyleClassName(_styleClassName);
	};

	useEffect(() => {
		const fetchAsyncValue = async (): Promise<void> =>
			updateStyleStates(await getRealValue(_value));

		if (checkIsValueAddon) {
			fetchAsyncValue();
		} else {
			updateStyleStates(_value);
		}
		// eslint-disable-next-line
	}, [_value]);

	if (!supportedTypes.includes(type)) {
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
