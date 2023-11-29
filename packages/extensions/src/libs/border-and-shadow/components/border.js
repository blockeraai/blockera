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
			if (attributes.borderColor) {
				setAttributes({
					...attributes,
					borderColor: newValue.all.color,
					style: {
						...(attributes?.style ?? {}),
						border: {
							...(attributes?.style?.border ?? {}),
							width: newValue.all.width,
							style: newValue.all.style,
						},
					},
				});

				return;
			}
		}

		if (
			!Array.from(attributes.publisherBorderRadius).length ||
			'all' === attributes.publisherBorderRadius.type
		) {
			const radius =
				attributes.publisherBorderRadius?.all ||
				(attributes?.style?.border?.radius ?? '');

			setAttributes({
				...attributes,
				borderColor: undefined,
				style: {
					...(attributes?.style ?? {}),
					border: {
						radius,
						top: {
							radius,
							width: newValue?.top?.width || newValue.all.width,
							color: newValue?.top?.color || newValue.all.color,
							style: newValue?.top?.style || newValue.all.style,
						},
						right: {
							radius,
							width: newValue?.right?.width || newValue.all.width,
							color: newValue?.right?.color || newValue.all.color,
							style: newValue?.right?.style || newValue.all.style,
						},
						bottom: {
							radius,
							width:
								newValue?.bottom?.width || newValue.all.width,
							color:
								newValue?.bottom?.color || newValue.all.color,
							style:
								newValue?.bottom?.style || newValue.all.style,
						},
						left: {
							radius,
							width: newValue?.left?.width || newValue.all.width,
							color: newValue?.left?.color || newValue.all.color,
							style: newValue?.left?.style || newValue.all.style,
						},
					},
				},
			});
		} else {
			setAttributes({
				...attributes,
				borderColor: undefined,
				style: {
					...(attributes?.style ?? {}),
					border: {
						radius:
							attributes.publisherBorderRadius.all ||
							attributes.style?.border?.radius ||
							'',
						top: {
							radius:
								attributes.publisherBorderRadius.topLeft ||
								attributes.style?.border?.radius?.topLeft ||
								'',
							width: newValue?.top?.width || newValue.all.width,
							color: newValue?.top?.color || newValue.all.color,
							style: newValue?.top?.style || newValue.all.style,
						},
						right: {
							radius:
								attributes.publisherBorderRadius.topRight ||
								attributes.style?.border?.radius?.topRight ||
								'',
							width: newValue?.right?.width || newValue.all.width,
							color: newValue?.right?.color || newValue.all.color,
							style: newValue?.right?.style || newValue.all.style,
						},
						bottom: {
							radius:
								attributes.publisherBorderRadius.bottomRight ||
								attributes.style?.border?.radius?.bottomRight ||
								'',
							width:
								newValue?.bottom?.width || newValue.all.width,
							color:
								newValue?.bottom?.color || newValue.all.color,
							style:
								newValue?.bottom?.style || newValue.all.style,
						},
						left: {
							radius:
								attributes.publisherBorderRadius.bottomLeft ||
								attributes.style?.border?.radius?.bottomLeft ||
								'',
							width: newValue?.left?.width || newValue.all.width,
							color: newValue?.left?.color || newValue.all.color,
							style: newValue?.left?.style || newValue.all.style,
						},
					},
				},
			});
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
					border && Array.from(border).length > 0
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
