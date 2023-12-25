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
import { isString, isUndefined, isEmpty } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { useBlockContext } from '../../../hooks';
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
	const { isNormalState, getAttributes } = useBlockContext();

	const toWPCompatible = (newValue: Object): Object => {
		if (!isNormalState() || isEmpty(newValue)) {
			return {};
		}

		const blockAttributes = getAttributes();

		if ('all' === newValue?.type) {
			if (isString(newValue?.all) && !newValue?.all?.endsWith('func')) {
				return {
					style: {
						...(blockAttributes?.style ?? {}),
						border: {
							...(blockAttributes?.style?.border ?? {}),
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
					...(blockAttributes?.style ?? {}),
					border: {
						...(blockAttributes?.style?.border ?? {}),
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

	function getDefaultValue() {
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
	}

	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'border-radius'),
				value: ((): Object => {
					if (borderRadius && borderRadius?.type) {
						return borderRadius;
					}

					return getDefaultValue();
				})(),
				attribute: 'publisherBorderRadius',
				blockName: block.blockName,
			}}
		>
			<BaseControl columns="columns-1" controlName="border-radius">
				<BorderRadiusControl
					label={__('Radius', 'publisher-core')}
					onChange={(newValue: Object, ref?: Object): void =>
						onChange('publisherBorderRadius', newValue, {
							ref,
							addOrModifyRootItems: toWPCompatible(newValue),
							deleteItemsOnResetAction: ['style.border.radius'],
						})
					}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
