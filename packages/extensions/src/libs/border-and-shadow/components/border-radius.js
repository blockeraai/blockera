// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	BorderRadiusControl,
	ControlContextProvider,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { THandleOnChangeAttributes } from '../../types';
import type { TBorderAndShadowDefaultProp } from '../types/border-and-shadow-props';

export const BorderRadius = ({
	block,
	borderRadius,
	defaultValue,
	onChange,
}: {
	block: Object,
	borderRadius?: Object,
	onChange: THandleOnChangeAttributes,
	defaultValue: TBorderAndShadowDefaultProp,
}): MixedElement => {
	const toWPCompatible = (newValue: Object): Object => {
		if ('all' === newValue?.type) {
			if (!newValue?.all?.endsWith('func')) {
				return {
					style: {
						...(block.attributes?.style ?? {}),
						border: {
							...(block.attributes?.style?.border ?? {}),
							radius: newValue.all,
						},
					},
				};
			}
		} else {
			let { topLeft, topRight, bottomRight, bottomLeft } = newValue;

			if (topLeft.endsWith('func')) {
				topLeft = '';
			}

			if (topRight.endsWith('func')) {
				topRight = '';
			}

			if (bottomRight.endsWith('func')) {
				bottomRight = '';
			}

			if (bottomLeft.endsWith('func')) {
				bottomLeft = '';
			}

			return {
				style: {
					...(block.attributes?.style ?? {}),
					border: {
						...(block.attributes?.style?.border ?? {}),
						radius: {
							topLeft,
							topRight,
							bottomRight,
							bottomLeft,
						},
					},
				},
			};
		}
	};

	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'border-radius'),
				value: ((): Object => {
					if (borderRadius && Array.from(borderRadius).length) {
						return borderRadius;
					}

					if (
						typeof defaultValue.border.radius === 'object' &&
						defaultValue.border.radius !== null
					) {
						return {
							type: 'custom',
							...defaultValue.border.radius,
						};
					}

					return {
						type: 'all',
						all: defaultValue.border.radius,
					};
				})(),
				attribute: 'publisherBorderRadius',
				blockName: block.blockName,
			}}
		>
			<BaseControl columns="columns-1" controlName="border-radius">
				<BorderRadiusControl
					label={__('Radius', 'publisher-core')}
					onChange={(newValue) =>
						onChange('publisherBorderRadius', newValue, {
							addOrModifyRootItems: toWPCompatible(newValue),
							deleteItems:
								'all' === newValue?.type &&
								block.attributes?.style?.border?.radius
									? ['style.border.radius']
									: [],
						})
					}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
