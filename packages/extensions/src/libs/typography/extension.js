/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { ColorField, TextShadowField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';

export function TypographyExtension({ children, config, ...props }) {
	const {
		typographyConfig: { publisherFontColor, publisherTextShadow },
	} = config;

	return (
		<>
			{isActiveField(publisherFontColor) && (
				<ColorField
					{...{
						...props,
						label: __('Color', 'publisher-core'),
						attribute: 'publisherFontColor',
					}}
				/>
			)}

			{isActiveField(publisherTextShadow) && (
				<TextShadowField
					{...{
						...props,
						config: publisherTextShadow,
						attribute: 'publisherTextShadow',
						label: __('Text Shadow', 'publisher-core'),
					}}
				/>
			)}
		</>
	);
}
