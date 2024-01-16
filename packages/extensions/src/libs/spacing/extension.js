// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	PanelBodyControl,
	BoxSpacingControl,
	ControlContextProvider,
} from '@publisher/controls';
import { isUndefined } from '@publisher/utils';
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { SpacingExtensionIcon } from './index';
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

export const SpacingExtension: ComponentType<TSpacingProps> = memo(
	({
		block,
		spacingConfig: { publisherSpacing },
		defaultValue,
		spacingValue,
		handleOnChangeAttributes,
		extensionProps,
	}: TSpacingProps): MixedElement => {
		return (
			<PanelBodyControl
				title={__('Spacing', 'publisher-core')}
				initialOpen={true}
				icon={<SpacingExtensionIcon />}
				className={componentClassNames(
					'extension',
					'extension-spacing'
				)}
			>
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
								onChange={(newValue) => {
									const toWPCompatible =
										!defaultValue.padding &&
										!defaultValue.margin
											? {
													style: {
														...(block?.attributes
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
								}}
								defaultValue={
									isUndefined(defaultValue)
										? {
												margin: fallbackValue,
												marginLock:
													'vertical-horizontal',
												padding: fallbackValue,
												paddingLock:
													'vertical-horizontal',
										  }
										: {
												padding: getSpacingValue({
													spacing: defaultValue,
													propId: 'padding',
													defaultValue: fallbackValue,
												}),
												paddingLock:
													defaultValue.paddingLock ??
													'vertical-horizontal',
												margin: getSpacingValue({
													spacing: defaultValue,
													propId: 'margin',
													defaultValue: fallbackValue,
												}),
												marginLock:
													defaultValue.marginLock ??
													'vertical-horizontal',
										  }
								}
								{...extensionProps.publisherSpacing}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
