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
	CustomPropertyControl,
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
import type { TAdvancedProps } from './types/advanced-props';
import { AdvancedExtensionIcon } from './index';

export const AdvancedExtension: ComponentType<TAdvancedProps> = memo(
	({
		block,
		advancedConfig: {
			publisherAttributes: publisherAttributesConfig,
			publisherCSSProperties,
		},
		values: { attributes, cSSProperties: properties },
		handleOnChangeAttributes,
		extensionProps,
	}: TAdvancedProps): MixedElement => {
		return (
			<PanelBodyControl
				title={__('Advanced', 'publisher-core')}
				initialOpen={true}
				icon={<AdvancedExtensionIcon />}
				className={componentClassNames(
					'extension',
					'extension-advanced'
				)}
			>
				{isActiveField(publisherAttributesConfig) && (
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
									'Custom HTML Attributes',
									'publisher-core'
								)}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherAttributes',
										newValue
									)
								}
								attributeElement={'a'}
								{...extensionProps.publisherAttributes}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherCSSProperties) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'properties'),
							value: properties,
							attribute: 'publisherCSSProperties',
							blockName: block.blockName,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl
							controlName="properties"
							columns="columns-1"
						>
							<CustomPropertyControl
								label={__(
									'Custom CSS Properties',
									'publisher-core'
								)}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherCSSProperties',
										newValue
									)
								}
								{...extensionProps.publisherCSSProperties}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
