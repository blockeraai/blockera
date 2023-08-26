/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

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
import { BlockEditContext } from '../../hooks';
import { generateExtensionId } from '../utils';
import { isActiveField } from '../../api/utils';

export function AdvancedExtension({ children, block, config, ...props }) {
	const {
		advancedConfig: { publisherAttributes },
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherAttributes) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'attributes'),
						value: attributes.publisherAttributes,
					}}
					storeName={'publisher-core/controls/repeater'}
				>
					<BaseControl controlName="attributes" columns="columns-1">
						<AttributesControl
							label={__('HTML Attributes', 'publisher-core')}
							onChange={(newValue) => {
								setAttributes({
									...attributes,
									attributes: newValue,
								});
							}}
							{...props}
							attributeElement={'a'}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}
		</>
	);
}
