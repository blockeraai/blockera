/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { ColorField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';

export function BackgroundExtension({ children, config, ...props }) {
	const {
		backgroundConfig: { publisherBackgroundColor },
	} = config;

	return (
		<>
			{isActiveField(publisherBackgroundColor) && (
				<ColorField
					{...{
						...props,
						label: __('Color', 'publisher-core'),
						attribute: 'publisherBackgroundColor',
					}}
				/>
			)}
		</>
	);
}
