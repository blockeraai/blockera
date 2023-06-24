/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { ColorField, SelectField, BackgroundField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { BlockEditContext } from '../../hooks';
import ClipPaddingIcon from './icons/clip-padding';
import ClipContentIcon from './icons/clip-content';
import ClipTextIcon from './icons/clip-text';
import ClipNoneIcon from './icons/clip-none';
import InheritIcon from '../../icons/inherit';

export function BackgroundExtension({ children, config, ...props }) {
	const {
		backgroundConfig: {
			publisherBackground,
			publisherBackgroundColor,
			publisherBackgroundClip,
		},
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherBackground) && (
				<BackgroundField
					label={__('Image & Gradient', 'publisher-core')}
					value={attributes.publisherBackground}
					onValueChange={(newValue) =>
						setAttributes({
							...attributes,
							publisherBackground: newValue,
						})
					}
					{...props}
				/>
			)}

			{isActiveField(publisherBackgroundColor) && (
				<ColorField
					{...{
						...props,
						label: __('Color', 'publisher-core'),
						attribute: 'publisherBackgroundColor',
						//
						defaultValue: '',
						value: attributes.publisherBackgroundColor,
						onValueChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherBackgroundColor: newValue,
							}),
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
								icon: <ClipNoneIcon />,
							},
							{
								label: __('Clip to Padding', 'publisher-core'),
								value: 'padding-box',
								icon: <ClipPaddingIcon />,
							},
							{
								label: __('Clip to Content', 'publisher-core'),
								value: 'content-box',
								icon: <ClipContentIcon />,
							},
							{
								label: __('Clip to Text', 'publisher-core'),
								value: 'text',
								icon: <ClipTextIcon />,
							},
							{
								label: __('Inherit', 'publisher-core'),
								value: 'inherit',
								icon: <InheritIcon />,
							},
						],
						//
						type: 'custom',
						defaultValue: 'none',
						value: attributes.publisherBackgroundClip,
						onChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherBackgroundClip: newValue,
							}),
					}}
				/>
			)}
		</>
	);
}
