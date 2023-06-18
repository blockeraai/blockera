/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { AttributesField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { BlockEditContext } from '../../hooks';

export function AdvancedExtension({ children, config, ...props }) {
	const {
		advancedConfig: { publisherAttributes },
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherAttributes) && (
				<AttributesField
					{...{
						...props,
						label: __('HTML Attributes', 'publisher-core'),
						value: attributes.publisherAttributes,
						onValueChange: (newValue) => {
							setAttributes({
								...attributes,
								attributes: newValue,
							});
						},
					}}
				/>
			)}
		</>
	);
}
