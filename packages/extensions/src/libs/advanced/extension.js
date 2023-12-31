// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	AttributesControl,
	CustomPropertyControl,
	BaseControl,
	ControlContextProvider,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { hasSameProps, generateExtensionId } from '../utils';
import type { TAdvancedProps } from './types/advanced-props';

export const AdvancedExtension: TAdvancedProps = memo<TAdvancedProps>(
	({
		block,
		config,
		children,
		values: { attributes, cSSProperties: properties },
		handleOnChangeAttributes,
		...props
	}: TAdvancedProps): MixedElement => {
		const {
			advancedConfig: {
				publisherAttributes: publisherAttributesConfig,
				publisherCSSProperties,
			},
		} = config;

		return (
			<>
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
								{...props}
								attributeElement={'a'}
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
								{...props}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{children}
			</>
		);
	},
	hasSameProps
);
