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
			}}
		>
			<BaseControl columns="columns-1" controlName="border-radius">
				<BorderRadiusControl
					label={__('Radius', 'publisher-core')}
					onChange={(newValue) =>
						onChange(
							'publisherBorderRadius',
							newValue,
							'',
							(
								attributes: Object,
								setAttributes: (attributes: Object) => void
							): void => {
								if ('all' === newValue.type) {
									setAttributes({
										...attributes,
										style: {
											...(attributes?.style ?? {}),
											border: {
												...(attributes?.style?.border ??
													{}),
												radius: newValue.all,
											},
										},
									});

									return;
								}

								const {
									topLeft,
									topRight,
									bottomRight,
									bottomLeft,
								} = newValue;

								setAttributes({
									...attributes,
									style: {
										...(attributes?.style ?? {}),
										border: {
											...(attributes?.style?.border ??
												{}),
											radius: {
												topLeft,
												topRight,
												bottomRight,
												bottomLeft,
											},
										},
									},
								});
							}
						)
					}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
