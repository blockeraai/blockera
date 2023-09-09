/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	AttributesControl,
	BaseControl,
	ControlContextProvider,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { hasSameProps, generateExtensionId } from '../utils';

export const AdvancedExtension = memo(
	({
		block,
		config,
		children,
		attributes,
		handleOnChangeAttributes,
		...props
	}) => {
		const {
			advancedConfig: { publisherAttributes: publisherAttributesConfig },
		} = config;

		return (
			<>
				{isActiveField(publisherAttributesConfig) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'attributes'),
							value: attributes,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl
							controlName="attributes"
							columns="columns-1"
						>
							<AttributesControl
								label={__('HTML Attributes', 'publisher-core')}
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

				{children}
			</>
		);
	},
	hasSameProps
);
