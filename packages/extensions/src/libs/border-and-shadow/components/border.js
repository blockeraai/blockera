// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { BoxBorderControl, ControlContextProvider } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { getColorValue } from '../utils';
import { generateExtensionId } from '../../utils';
import type { THandleOnChangeAttributes } from '../../types';
import type { TBorderAndShadowDefaultProp } from '../types/border-and-shadow-props';

export const Border = ({
	block,
	border,
	onChange,
	defaultValue,
}: {
	block: Object,
	border?: Object,
	onChange: THandleOnChangeAttributes,
	defaultValue: TBorderAndShadowDefaultProp,
}): MixedElement => {
	const callback = (
		newValue: Object,
		attributes: Object,
		setAttributes: (attributes: Object) => void
	): void => {
		if ('all' === newValue.type) {
			const customized = {
				...attributes,
				borderColor:
					newValue?.all?.color ||
					attributes.borderColor ||
					attributes?.style?.border?.color,
				style: {
					...(attributes?.style ?? {}),
					border: {
						...(attributes?.style?.border ?? {}),
						color:
							newValue?.all?.color ||
							attributes.borderColor ||
							attributes?.style?.border?.color,
						width: newValue?.all?.width,
						style: newValue?.all?.width ? newValue?.all?.style : '',
					},
				},
			};

			delete customized?.style?.border?.top;
			delete customized?.style?.border?.right;
			delete customized?.style?.border?.bottom;
			delete customized?.style?.border?.left;

			setAttributes(customized);
		} else {
			const customized = {
				...attributes,
				borderColor: undefined,
				style: {
					...(attributes?.style ?? {}),
					border: {
						...(attributes?.style?.border ?? {}),
						top: {
							width: newValue?.top?.width,
							color: newValue?.top?.color,
							style: newValue?.top?.width
								? newValue?.top?.style
								: '',
						},
						right: {
							width: newValue?.right?.width,
							color: newValue?.right?.color,
							style: newValue?.right?.width
								? newValue?.right?.style
								: '',
						},
						bottom: {
							width: newValue?.bottom?.width,
							color: newValue?.bottom?.color,
							style: newValue?.bottom?.width
								? newValue?.bottom?.style
								: '',
						},
						left: {
							width: newValue?.left?.width,
							color: newValue?.left?.color,
							style: newValue?.left?.width
								? newValue?.left?.style
								: '',
						},
					},
				},
			};

			delete customized.style.border.color;
			delete customized.style.border.width;
			delete customized.style.border.style;

			setAttributes(customized);
		}
	};
	const getNormalDefaultValue = (): Object => {
		const { top, right, bottom, left } = defaultValue.border;

		if ((!defaultValue.borderColor && top) || right || bottom || left) {
			return {
				type: 'custom',
				top: {
					...top,
					color: getColorValue(top?.color || ''),
				},
				right: {
					...right,
					color: getColorValue(right?.color || ''),
				},
				bottom: {
					...bottom,
					color: getColorValue(bottom?.color || ''),
				},
				left: {
					...left,
					color: getColorValue(left?.color || ''),
				},
			};
		}

		return {
			all: {
				color: getColorValue(defaultValue.borderColor),
				style: defaultValue.border?.style || '',
				width: defaultValue.border?.width || '',
			},
			type: 'all',
		};
	};

	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'border'),
				value:
					border && Object.values(border).length > 0
						? border
						: getNormalDefaultValue(),
			}}
		>
			<BoxBorderControl
				columns="columns-1"
				label={__('Border Line', 'publisher-core')}
				onChange={(newValue) => {
					onChange(
						'publisherBorder',
						newValue,
						'',
						(
							attributes: Object,
							setAttributes: (attributes: Object) => void
						): void => callback(newValue, attributes, setAttributes)
					);
				}}
			/>
		</ControlContextProvider>
	);
};
