/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { AttributesField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';

export function AdvancedExtension({ children, config, ...props }) {
	const {
		advancedConfig: { publisherAttributes },
	} = config;

	return (
		<>
			{isActiveField(publisherAttributes) && (
				<AttributesField
					{...{
						...props,
						attribute: 'publisherAttributes',
						label: __('HTML Attributes', 'publisher-core'),
					}}
				/>
			)}
		</>
	);
}
