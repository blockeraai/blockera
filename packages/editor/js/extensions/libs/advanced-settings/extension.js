// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	AttributesControl,
	BaseControl,
	PanelBodyControl,
	ControlContextProvider,
} from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';
import { EditorFeatureWrapper } from '../../../';
import { hasSameProps } from '@blockera/utils';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
import type { TAdvancedSettingsProps } from './types/advanced-props';
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
				extensionConfig.blockeraAttributes,
				values?.blockeraAttributes,
				attributes.blockeraAttributes.default
			);

			if (!isShowAttributes) {
				return <></>;
			}

			return (
				<PanelBodyControl
					title={__('Advanced', 'blockera')}
					initialOpen={true}
					icon={<Icon icon="extension-advanced" />}
					className={extensionClassNames('advanced-settings')}
				>
					<ExtensionSettings
						buttonLabel={__('More Advanced Settings', 'blockera')}
						features={extensionConfig}
						update={(newSettings) => {
							setSettings(newSettings, 'advancedSettingsConfig');
						}}
					/>

					<EditorFeatureWrapper
						isActive={isShowAttributes}
						config={extensionConfig.blockeraAttributes}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'attributes'),
								value: values.blockeraAttributes,
								attribute: 'blockeraAttributes',
								blockName: block.blockName,
							}}
							storeName={'blockera/controls/repeater'}
						>
							<BaseControl
								controlName="attributes"
								columns="columns-1"
							>
								<AttributesControl
									label={__(
										'Custom HTML Attributes',
										'blockera'
									)}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'blockeraAttributes',
											newValue,
											{ ref }
										)
									}
									defaultValue={
										attributes.blockeraAttributes.default
									}
									{...extensionProps.blockeraAttributes}
								/>
							</BaseControl>
						</ControlContextProvider>
					</EditorFeatureWrapper>
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
