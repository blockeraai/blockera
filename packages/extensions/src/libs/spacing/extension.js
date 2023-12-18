// @flow
/**
 * External dependencies
 */
import { memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	BoxSpacingControl,
	ControlContextProvider,
} from '@publisher/controls';
import { isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { getSpacingValue } from './utils/get-spacing-value';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TSpacingProps } from './types/spacing-props';

const fallbackValue = {
	top: '',
	right: '',
	bottom: '',
	left: '',
};

export const SpacingExtension: TSpacingProps = memo<TSpacingProps>(
	({
		block,
		config,
		children,
		defaultValue,
		spacingValue,
		handleOnChangeAttributes,
		...props
	}: TSpacingProps): MixedElement => {
		const {
			spacingConfig: { publisherSpacing },
		} = config;

		return (
			<>
				{isActiveField(publisherSpacing) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'spacing'),
							value: spacingValue,
							attribute: 'publisherSpacing',
							blockName: block.blockName,
						}}
					>
						<BaseControl controlName="box-spacing">
							<BoxSpacingControl
								{...{
									...props,
									defaultValue: isUndefined(defaultValue)
										? {
												margin: fallbackValue,
												padding: fallbackValue,
										  }
										: {
												padding: getSpacingValue({
													spacing: defaultValue,
													propId: 'padding',
													defaultValue: fallbackValue,
												}),
												margin: getSpacingValue({
													spacing: defaultValue,
													propId: 'margin',
													defaultValue: fallbackValue,
												}),
										  },
									//
									onChange: (newValue) => {
										const toWPCompatible =
											!defaultValue.padding &&
											!defaultValue.margin
												? {
														style: {
															...(block
																?.attributes
																?.style ?? {}),
															spacing: newValue,
														},
												  }
												: {};

										handleOnChangeAttributes(
											'publisherSpacing',
											newValue,
											{
												addOrModifyRootItems:
													toWPCompatible,
											}
										);
									},
								}}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
