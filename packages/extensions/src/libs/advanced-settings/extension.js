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

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { hasSameProps, generateExtensionId } from '../utils';
import type { TAdvancedSettingsProps } from './types/advanced-props';
import { AdvancedSettingsExtensionIcon } from './index';

export const AdvancedSettingsExtension: ComponentType<TAdvancedSettingsProps> =
	memo(
		({
			block,
			advancedConfig,
			values: { attributes },
			handleOnChangeAttributes,
			extensionProps,
		}: TAdvancedSettingsProps): MixedElement => {
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
					{isActiveField(advancedConfig.publisherAttributes) && (
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'attributes'),
								value: attributes,
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
										'HTML Attributes',
										'publisher-core'
									)}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'publisherAttributes',
											newValue,
											{ ref }
										)
									}
									attributeElement={'a'}
									{...extensionProps.publisherAttributes}
								/>
							</BaseControl>
						</ControlContextProvider>
					)}
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
