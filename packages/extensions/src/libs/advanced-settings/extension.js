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
	AttributesControl,
	BaseControl,
	PanelBodyControl,
	ControlContextProvider,
} from '@publisher/controls';
import { componentClassNames } from '@publisher/classnames';
import { FeatureWrapper } from '@publisher/components';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { hasSameProps, generateExtensionId } from '../utils';
import type { TAdvancedSettingsProps } from './types/advanced-props';
import { AdvancedSettingsExtensionIcon } from './index';
import { ExtensionSettings } from '../settings';

export const AdvancedSettingsExtension: ComponentType<TAdvancedSettingsProps> =
	memo(
		({
			block,
			extensionConfig,
			values,
			attributes,
			handleOnChangeAttributes,
			extensionProps,
			setSettings,
		}: TAdvancedSettingsProps): MixedElement => {
			const isShowAttributes = isShowField(
				extensionConfig.publisherAttributes,
				values?.publisherAttributes,
				attributes.publisherAttributes.default
			);

			if (!isShowAttributes) {
				return <></>;
			}

			return (
				<PanelBodyControl
					title={__('Advanced', 'publisher-core')}
					initialOpen={true}
					icon={<AdvancedSettingsExtensionIcon />}
					className={componentClassNames(
						'extension',
						'extension-advanced-settings'
					)}
				>
					<ExtensionSettings
						features={extensionConfig}
						update={(newSettings) => {
							setSettings(newSettings, 'advancedSettingsConfig');
						}}
					/>

					<FeatureWrapper
						isActive={isShowAttributes}
						isActiveOnStates={
							extensionConfig.publisherAttributes.isActiveOnStates
						}
						isActiveOnBreakpoints={
							extensionConfig.publisherAttributes
								.isActiveOnBreakpoints
						}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'attributes'),
								value: values.publisherAttributes,
								attribute: 'publisherAttributes',
								blockName: block.blockName,
							}}
							storeName={'publisher-core/controls/repeater'}
						>
							<BaseControl
								controlName="attributes"
								columns="columns-1"
							>
								<AttributesControl
									label={__(
										'Custom HTML Attributes',
										'publisher-core'
									)}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'publisherAttributes',
											newValue,
											{ ref }
										)
									}
									defaultValue={
										attributes.publisherAttributes.default
									}
									{...extensionProps.publisherAttributes}
								/>
							</BaseControl>
						</ControlContextProvider>
					</FeatureWrapper>
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
