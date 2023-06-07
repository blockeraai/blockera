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
import { useContext } from '@wordpress/element';
import { BlockEditContext } from '../../hooks';

export function TypographyExtension({ children, config, ...props }) {
	const {
		typographyConfig: { publisherFontColor, publisherTextShadow },
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherFontColor) && (
				<ColorField
					{...{
						...props,
						label: __('Color', 'publisher-core'),
						//
						initValue: '',
						value: attributes.publisherFontColor,
						onValueChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherFontColor: newValue,
							}),
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
