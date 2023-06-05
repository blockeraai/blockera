/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { ColorField, SelectField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';

export function BackgroundExtension({ children, config, ...props }) {
	const {
		backgroundConfig: { publisherBackgroundColor, publisherBackgroundClip },
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

			{isActiveField(publisherBackgroundClip) && (
				<SelectField
					{...{
						...props,
						label: __('Clipping', 'publisher-core'),
						options: [
							{
								label: __('None', 'publisher-core'),
								value: 'none',
							},
							{
								label: __('Clip to Padding', 'publisher-core'),
								value: 'padding-box',
							},
							{
								label: __('Clip to Content', 'publisher-core'),
								value: 'content-box',
							},
							{
								label: __('Clip to Text', 'publisher-core'),
								value: 'text',
							},
						],
						//
						initValue: 'default',
						attribute: 'publisherBackgroundClip',
					}}
				/>
			)}
		</>
	);
}
