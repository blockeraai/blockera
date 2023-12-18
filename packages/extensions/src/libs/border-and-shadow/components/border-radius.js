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
import { isString, isUndefined } from '@publisher/utils';

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
			if (isString(newValue?.all) && !newValue?.all?.endsWith('func')) {
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

			if (isString(topLeft)) {
				if (topLeft.endsWith('func')) {
					topLeft = '';
				}
			} else {
				topLeft = '';
			}

			if (isString(topRight)) {
				if (topRight.endsWith('func')) {
					topRight = '';
				}
			} else {
				topRight = '';
			}

			if (isString(bottomRight)) {
				if (bottomRight.endsWith('func')) {
					bottomRight = '';
				}
			} else {
				bottomRight = '';
			}

			if (isString(bottomLeft)) {
				if (bottomLeft.endsWith('func')) {
					bottomLeft = '';
				}
			} else {
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

					// an object contains radius values
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
						all: !isUndefined(defaultValue.border.radius)
							? defaultValue.border.radius
							: '',
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
